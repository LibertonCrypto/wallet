<template>
  <div class="create wrapper">
    <h1 class="home__heading">
      <template v-if="accountsCount > 0">{{
        $t('create.heading.default')
      }}</template>
      <template v-else>{{ $t('create.heading.first_time') }}</template>
    </h1>

    <div class="create__phrase-container">
      <div class="buttons mb-2">
        <copy :content="state.phrase">
          <template #trigger>
            <it-button>
              <i class="las la-copy"></i>
            </it-button>
          </template>
        </copy>

        <it-select
          v-model="state.words"
          :options="wordsOptions"
          @update:model-value="generate"
        >
          <template #selected-option="{ props }">
            {{ $t('create.words_count', { n: props.modelValue.value }) }}
          </template>

          <template #icon>
            <i class="las la-angle-down" />
          </template>
        </it-select>

        <it-select
          v-model="state.dictionary"
          :options="dictOptions"
          @update:model-value="generate"
        >
          <template #selected-option="{ props }">
            {{ dicts[props.modelValue.value] }}
          </template>

          <template #icon>
            <i class="las la-angle-down" />
          </template>
        </it-select>

        <it-button class="on-right" icon="redo-alt" @click="generate">
          {{ $t('create.buttons.generate') }}
        </it-button>
        <a href="#" class="create__generate" @click.prevent="generate">{{}}</a>
      </div>

      <div v-if="mode === 'generate'" class="create__phrase">
        <it-tag v-for="word of state.phrase.split(' ')" :key="word">
          {{ word }}
        </it-tag>
      </div>

      <div v-else class="form-input">
        <it-input
          v-model="state.phrase"
          class="form-input"
          :label-top="$t('create.phrase.label')"
        ></it-input>
      </div>

      <it-alert
        class="mb-1"
        type="warning"
        icon="exclamation-circle"
        :body="$t('create.phrase.text')"
        :title="$t('create.phrase.heading')"
      />

      <div class="form-input">
        <it-input
          v-model="state.name"
          :label-top="
            $t('create.account_name') + ' (' + $t('global.optional') + ')'
          "
        ></it-input>
      </div>

      <div class="row mb-2">
        <div class="col">
          <it-input
            v-model="state.password"
            type="password"
            @blur="resetErrors"
            :message="state.passwordError"
            :status="state.passwordError ? 'danger' : 'default'"
            :label-top="$t('global.password')"
          ></it-input>
        </div>

        <div class="col">
          <it-input
            v-model="state.confirmation"
            type="password"
            @blur="resetErrors"
            :message="state.confirmationError"
            :status="state.confirmationError ? 'danger' : 'default'"
            :label-top="$t('global.password_confirmation')"
          ></it-input>
        </div>
      </div>

      <div class="buttons">
        <it-button type="primary" @click="create">{{
          $t('global.buttons.continue')
        }}</it-button>
        <it-button @click="switchMode">
          {{
            mode === 'restore'
              ? $t('create.buttons.generate_mode')
              : $t('create.buttons.restore_mode')
          }}
        </it-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAccounts } from '@/features'
import { inject, ref, reactive, onMounted } from 'vue'

const r = useRouter()
const mode = ref('generate')
const TonClient = inject('ton')
const { t, locale } = useI18n()
const dicts = TonClient.dictionaries
const { create: createAccount, count: accountsCount } = useAccounts()

/*
 * Data
 */
let state = reactive({
  /*
   * User inpurt
   */
  name: '',
  phrase: '',
  password: '',
  confirmation: '',
  words: { value: 12 },
  dictionary: { value: 1 },

  /*
   * Errors
   */
  passwordError: null,
  confirmationError: null,
})

/*
 * Validation rules
 */
const passwordRules = [
  (val) => val.length >= 4 || t('create.validation.length_required', { n: 4 }),
]
const passwordConfirmRules = [
  (val) => val === state.password || t('create.validation.do_not_match'),
]

const resetErrors = () => {
  state.passwordError = null
  state.confirmationError = null
}

/*
 * Map data for selects
 */
const dictOptions = Object.entries(dicts).map(([value, name]) => ({
  name,
  value,
}))
const wordsOptions = [12, 24].map((n) => ({
  value: n,
  name: t('create.words_count', { n }),
}))

/*
 * Methods
 */
const generate = async () => {
  mode.value = 'generate'

  state.phrase = await TonClient.getRandomPhrase({
    words: state.words.value,
    dictionary: state.dictionary.value,
  })
}

const switchMode = () => {
  if (mode.value === 'restore') {
    return generate()
  }

  mode.value = 'restore'
  state.phrase = ''
}

const create = async () => {
  // @TODO: validation lib
  for (const rule of passwordRules) {
    const res = rule(state.password)

    if (res !== true) {
      state.passwordError = res
      return false
    }
  }

  for (const rule of passwordConfirmRules) {
    const res = rule(state.confirmation)

    if (res !== true) {
      state.confirmationError = res
      return false
    }
  }

  await createAccount({
    name: state.name,
    phrase: state.phrase,
    words: state.words.value,
    password: state.password,
    dictionary: state.dictionary.value,
  })
  await r.push('/')
}

/*
 * Hooks
 */
onMounted(generate)
</script>
