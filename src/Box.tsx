export interface BoxProps {
    value: string;
    onClick: () => void;
}

export function Box(props: BoxProps) {
    let classes = props.value === "H"?  `grid-square-hide` : "grid-square-show";
    classes = props.value === "M"?  `grid-square-mine` : classes;
    return <div className={classes} style={{width: 20, height: 20, fontSize: "15px"}} onClick={props.onClick}>
        {props.value !== "H" ? props.value : ""}</div>
}