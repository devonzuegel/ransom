// Copied from https://git.io/vpusN
interface IDefaultPropsType<T> {
  defaultProps?: T
}
// tslint:disable-next-line:no-unused-expression
type ExtractProps<T> = T extends React.ComponentType<infer Q> ? Q : never
// tslint:disable-next-line:no-unused-expression
type ExtractDefaultProps<T> = T extends IDefaultPropsType<infer Q> ? Q : never
type RequiredProps<P, DP> = Pick<P, Exclude<keyof P, keyof DP>>
type RequiredAndPartialDefaultProps<RP, DP> = RP & Partial<DP>

type ComponentTypeWithDefaultProps<T> = React.ComponentType<
  RequiredAndPartialDefaultProps<
    RequiredProps<ExtractProps<T>, ExtractDefaultProps<T>>,
    ExtractDefaultProps<T>
  >
>

export function withDefaultProps<T extends React.ComponentType<any>>(component: T) {
  return component as ComponentTypeWithDefaultProps<T>
}
