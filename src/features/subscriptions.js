import { useTon } from '@/features/ton'

export const useSubscriptions = () => {
  const ton = useTon()

  return {
    watchBalance: ton.watchBalance,
  }
}
