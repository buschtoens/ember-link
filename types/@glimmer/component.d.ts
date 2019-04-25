export default class Component<T extends object = object> {
  args: Readonly<T>;
  isDestroying: boolean;
  isDestroyed: boolean;
  constructor(owner: unknown, args: T);
  willDestroy(): void;
}
