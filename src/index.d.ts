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
    Pick<AnimationConfig, 'loop' | 'renderer' | 'rendererSettings' | 'audioFactory'> & {
      play?: boolean
      goTo?: number
      speed?: number
      direction?: AnimationDirection
      segments?: AnimationSegment | AnimationSegment[]

      onComplete?: AnimationEventCallback
      onLoopComplete?: AnimationEventCallback
      onEnterFrame?: AnimationEventCallback
      onSegmentStart?: AnimationEventCallback
    } & ({ path?: string } | { animationData?: object })

  const Lottie: React.FC<LottieProps>

  export default Lottie
}
