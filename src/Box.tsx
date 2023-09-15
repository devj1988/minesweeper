import mineImg from "./noun-mine-965385.svg"

export interface BoxProps {
    value: string;
    onClick: () => void;
}

export function Box(props: BoxProps) {
    let classes = props.value === "H"?  `grid-square-hide` : "grid-square-show";
    classes = props.value === "M"?  `grid-square-mine` : classes;
    let content;
    if (props.value === "M") {
        content = (<img src={mineImg}/>);
    } else if (props.value === "H") {
        content = "";
    } else { 
        content = props.value;
    }

    return <div className={classes} style={{width: 20, height: 20, fontSize: "15px"}} onClick={props.onClick}>
        {/* {props.value !== "H" ? props.value : ""}
        {props.value === "M" ? <img src="./pngegg.png"/>: ""} */}
        {content}
        </div>
}