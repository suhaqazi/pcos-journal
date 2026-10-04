import { ComponentProps, ReactNode, useId } from "react";

// Label + input, used by every form. The label is linked to the input,
// so clicking the label focuses the field and screen readers announce it.

const tones = {
  default: "border-burgundy/20 focus:border-burgundy/50",
  success: "border-olive/50",
  error: "border-error/50",
};

export interface TextFieldProps extends ComponentProps<"input"> {
  label: ReactNode;
  labelExtra?: ReactNode; // something on the right of the label, e.g. "Forgot password?"
  trailing?: ReactNode; // something inside the input on the right, e.g. a show/hide button
  hint?: ReactNode; // anything under the input, e.g. password rules
  tone?: keyof typeof tones;
  wrapperClassName?: string; // e.g. "sm:col-span-2" in a grid
}

export default function TextField({
  label,
  labelExtra,
  trailing,
  hint,
  tone = "default",
  wrapperClassName = "",
  ...inputProps
}: TextFieldProps) {
  const id = useId();

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {labelExtra}
      </div>

      <div className="relative">
        <input
          id={id}
          {...inputProps}
          className={`w-full rounded-xl border bg-linen py-3 pl-4 text-[0.9375rem] text-ink outline-none transition focus:ring-2 focus:ring-burgundy/15 ${
            trailing ? "pr-12" : "pr-4"
          } ${tones[tone]}`}
        />
        {trailing && (
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center">
            {trailing}
          </div>
        )}
      </div>

      {hint}
    </div>
  );
}
