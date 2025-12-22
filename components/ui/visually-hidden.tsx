import * as React from "react"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const VisuallyHidden = React.forwardRef<HTMLDivElement, VisuallyHiddenProps>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
      }}
      {...props}
    >
      {children}
    </div>
  )
)

VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
