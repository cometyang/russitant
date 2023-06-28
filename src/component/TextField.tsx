import React, {
  FormEvent,
  useEffect,
  useState,
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useRef
} from "react";
import { RiCloseCircleLine as ClearIcon } from "react-icons/ri";
import useProps from "../hook/useProps";
import clsx from "clsx";

type TextFieldProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  type?: 'text' | 'password'; // Default 'text'
  clearable?: boolean;
  clazz?: string;
  className?: string;
  style?: CSSProperties;
};

export type StandardProps = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, keyof TextFieldProps>;

const TextField = (_props: TextFieldProps & StandardProps) => {
  const { props, rest } = useProps<TextFieldProps, StandardProps>(_props, ["prefix", "suffix", "type", "clearable", "clazz", "className", "style"]);
  const [value, setValue] = useState<string>(String(rest.value || ''));
  const ref = useRef<HTMLInputElement | null>(null);

  const onInput = (ev: FormEvent<HTMLInputElement>): void => {
    setValue((ev.target as HTMLInputElement).value || '');
    rest.onInput?.(ev);
  };

  const clear = (): void => {
    if (ref.current) {
      ref.current!.value = '';
      ref.current!.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }
  };

  useEffect(() => {
    if (rest.value !== value) {
      setValue(String(rest.value || ''));
    }
  }, [rest.value]);

  return (
    <div className={ clsx("group min-h-[32px] flex items-center justify-between bg-foreground-mute rounded-lg border border-primary-mute hover:bg-foreground hover:border-primary active:bg-foreground-accent active:border-primary-accent", props.className) } style={ props.style }>
      { props.prefix }
      <input { ...rest } ref={ ref } value={ value } onInput={ onInput } type={ props.type || "text" } className={ clsx("w-full h-full px-1 placeholder:text-primary-mute text-primary-mute group-hover:text-primary group-active:text-primary-accent bg-transparent border-transparent focus:border-transparent focus:ring-0", props.clazz) } />
      { props.clearable && value && <ClearIcon onClick={ clear } size={ 16 } strokeWidth={ 2 } className="fill-primary cursor-pointer min-w-[16px] mr-1" /> }
      { props.suffix }
    </div>
  );
};

export default TextField;