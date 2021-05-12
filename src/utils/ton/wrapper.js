import { toSHA256 } from "../convert";
import { randomBytes } from "../random";
import {TonClient} from "@tonclient/core";
import { InternalTransfer } from '../contracts'

/*
 * Queries
 */
import accountShort from "../queries/accountShort";
import activityHistory from "../queries/accountActivity";

export class TonWrapper {
  client = null;
  dictionaries = {
    1: 'English',
    2: '汉语',
    3: '漢語',
    4: 'Français',
    5: 'Italiano',
    6: '日本語',
    7: '한국어',
    8: 'Español',
  }

  constructor (endpoints) {
    this.client = this.createClient(endpoints)
  }

  createClient(endpoints = ['net.ton.dev']) {
    return new TonClient({
      network: {
        endpoints,
        message_retries_count: 3
      },

      abi: {
        message_expiration_timeout: 30000,
      }
    })
  }

  switchNetwork (endpoints) {
    this.client = this.createClient(endpoints)
  }

  async chacha20 ({ data, nonce, key }) {
    const { data: result } = await this.client.crypto.chacha20({
      data, nonce, key
    })

    return result
  }

  async encrypt ({ data, password }) {
    const nonce = randomBytes(12)

    const encrypted = await this.chacha20({
      nonce,
      data: btoa(data),
      key: await toSHA256(password)
    })

    return {
      nonce,
      data: encrypted,
    }
  }

  async decrypt({ data, nonce, password }) {
    const result = await this.chacha20({
      data,
      nonce,
      key: await toSHA256(password)
    })

    return atob(result)
  }

  async query (query, variables) {
    const { result } = await this.client.net.query({ query, variables })

    return result
  }

  explorer ({ transaction, wallet, networkId }) {
    const url = String(networkId) === '0' ? 'ton.live' : 'net.ton.live'

    if (transaction) {
      return `https://${url}/transactions/transactionDetails?id=${transaction}`
    }

    if (wallet) {
      return `https://${url}/accounts/accountDetails?id=${wallet}`
    }

    return ''
  }

  async accountShort(id) {
    const result = await this.query(accountShort, { id })

    return result.data.accounts[0] || null
  }

  async activityHistory(variables) {
    const result = await this.query(activityHistory, variables)

    return result.data // .accounts[0] || null
  }

  async unsignedDeployMessage (data) {
    const params = data.contract.getDeployParams({
      public: data.public
    })

    return this.client.abi.encode_message(params)
  }

  async createDeployMessage(contract, keys) {
    return this.client.abi.encode_message(contract.getDeployParams(keys))
  }

  isHex (str) {
    return /[0-9A-Fa-f]{6}/g.test(str)
  }

  async getDefaultPayload (data) {
    if (! data.comment) {
      return ''
    }

    const { body } = await this.client.abi.encode_message_body(InternalTransfer.getBodyParams(data.comment))

    return body
  }

  async estimateTransactionFee ({ message, account, contract }) {
    const { fees } = await this.client.tvm.run_executor({
      message,
      account: {
        boc: account,
        type: 'Account',
      },
      abi: {
        type: 'Contract',
        value: contract.abi,
      }
    })

    return fees.total_account_fees
  }

  async createTransferMessage({ contract, data, wallet }) {
    const params = contract.getTransferParams({
      wallet,
      data: {
        ...data,
        payload: await this.getDefaultPayload(data)
      }
    })

    const { message } = await this.client.abi.encode_message(params)

    return message
  }

  async transfer ({ contract, data, wallet }) {
    const params = contract.getTransferParams({
      wallet,
      data: {
        ...data,
        payload: await this.getDefaultPayload(data)
      }
    })

    return this.client.processing.process_message({
      send_events: false,
      message_encode_params: params,
    })
  }

  async deploy(contract, keys) {
    return this.client.processing.process_message({
      send_events: false,
      message_encode_params: contract.getDeployParams(keys),
    })
  }

  async getRandomPhrase({ words = 12, dictionary = 1 }) {
    const { phrase } = await this.client.crypto.mnemonic_from_random({
      word_count: words,
      dictionary: parseInt(dictionary),
    })

    return phrase
  }

  async getMasterKey({ words, dictionary, phrase }) {
    const { xprv } = await this.client.crypto.hdkey_xprv_from_mnemonic({
      phrase,
      word_count: words,
      dictionary: parseInt(dictionary),
    });

    return xprv
  }

  async getKeyPair({ xprv, index }) {
    const path = `m/44'/396'/0'/0/${index}`;
    const { xprv: derived } = await this.client.crypto.hdkey_derive_from_xprv_path({
      xprv,
      path,
    });

    const { secret } = await this.client.crypto.hdkey_secret_from_xprv({
      xprv: derived,
    })

    const keypair = await this.client.crypto.nacl_sign_keypair_from_secret_key({ secret })

    keypair.secret = keypair.secret.substring(0, keypair.public.length)

    return keypair
  }
}
