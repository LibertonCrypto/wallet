<template>
  <div class="create">
    <h5 class="create__heading">{{ $t('create.heading') }}</h5>

    <div class="create__phrase-container">
      <div class="create__phrase-header">
        <q-select dense
                  filled
                  emit-value
                  :options="wordsOptions"
                  v-model="createOptions.words"
                  @update:model-value="generate"
                  >
          <template v-slot:selected-item>
            {{ $t('create.words_count', { n: createOptions.words }) }}
          </template>
        </q-select>

        <q-select dense
                  filled
                  emit-value
                  class="on-right"
                  :options="dictOptions"
                  v-model="createOptions.dictionary"
                  @update:model-value="generate"
                  >
          <template v-slot:selected-item="scope">
            {{ dicts[scope.opt] }}
          </template>
        </q-select>

        <q-btn color="white" text-color="black" class="on-right" @click="generate">
          <q-icon name="las la-redo-alt" class="on-left" /> {{ $t('create.buttons.generate') }}
        </q-btn>
        <a href="#" class="create__generate" @click.prevent="generate">{{ }}</a>
      </div>

      <div class="create__phrase" v-if="mode === 'generate'">
        {{ createOptions.phrase }}
      </div>

      <q-input square dense filled v-model="createOptions.phrase" class="q-mb-md" v-else
               :label="$t('create.phrase')"></q-input>

      <q-banner class="create__warning">
        <q-icon name="las la-exclamation-circle" /> {{ $t('create.phrase_alert') }}
      </q-banner>

      <div class="row q-mb-md q-col-gutter-sm">
        <div class="col-12 on-top">
          <q-input square dense filled v-model="createOptions.name" type="password"
                   :label="$t('create.account_name') + ' (' + $t('global.optional') + ')'"></q-input>
        </div>

        <div class="col-xs-12 col-sm-6">
          <q-input square dense filled v-model="password.value" type="password" :label="$t('global.password')"
                   :rules="passwordRules" :lazy-rules="true"></q-input>
        </div>

        <div class="col-xs-12 col-sm-6">
          <q-input square dense filled v-model="password.confirmation" type="password"
                   :label="$t('global.password_confirmation')"
                   :rules="passwordConfirmRules" :lazy-rules="true"></q-input>
        </div>
      </div>

      <q-btn class="bg-primary text-white on-left" @click="create">{{ $t('global.buttons.continue') }}</q-btn>
      <q-btn flat class="text-black" @click="restore" v-if="mode === 'generate'">{{ $t('create.buttons.restore') }}</q-btn>
    </div>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { inject, ref, reactive, onMounted } from 'vue'

  const r = useRouter()
  const mode = ref('generate')
  const { t, locale } = useI18n()
  const TonClient = inject('ton')
  const dicts = TonClient.dictionaries
  const { dispatch, state } = useStore()

  /*
   * Data
   */
  let createOptions = reactive({
    name: '',
    words: 12,
    phrase: '',
    dictionary: 1,
  })

  let password = reactive({
    value: '',
    confirmation: '',
  })

  /*
   * Validation rules
   */
  const passwordRules = [val => val.length > 3 || t('create.validation.length_required')]
  const passwordConfirmRules = [val => val === password.value || t('create.validation.do_not_match')]

  /*
   * Map data for selects
   */
  const dictOptions = Object.entries(dicts).map(([value, label]) => ({ label, value }))
  const wordsOptions = [12, 24].map(n => ({ value: n, label: t('create.words_count', { n }) }))

  /*
   * Methods
   */
  const generate = async () => {
    mode.value = 'generate'

    createOptions.phrase = await TonClient.getRandomPhrase(createOptions)
  }

  const restore = () => {
    mode.value = 'restore'
    createOptions.phrase = ''
  }

  const create = async () => {
    const xprv = await TonClient.getMasterKey(createOptions)

    await dispatch('accounts/create', {
      xprv,
      name: createOptions.name,
      password: password.value,
      phrase: createOptions.phrase,
    })

    await r.push('/')
  }

  /*
   * Hooks
   */
  onMounted(generate)
</script>
