declare module 'react-lottie-player' {
  import type {
    AnimationConfig,
    AnimationDirection,
    AnimationEventCallback,
    AnimationSegment
  } from 'lottie-web'

  type LottieProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > &
    Pick<AnimationConfig, 'loop' | 'renderer' | 'rendererSettings'> & {
      play?: boolean
      goTo?: number
      speed?: number
      direction?: AnimationDirection
      segments?: AnimationSegment | AnimationSegment[]
      // Replace with AnimationConfig definition after this is merged:
      // https://github.com/airbnb/lottie-web/pull/2547
      audioFactory?(assetPath: string): {
        play(): void
        seek(): void
        playing(): void
        rate(): void
        setVolume(): void
      }

      onComplete?: AnimationEventCallback
      onLoopComplete?: AnimationEventCallback
      onEnterFrame?: AnimationEventCallback
      onSegmentStart?: AnimationEventCallback
    } & ({ path?: string } | { animationData?: object })

  const Lottie: React.FC<LottieProps>

  export default Lottie
}
