import mineImg from "./noun-mine-965385.svg"

export interface BoxProps {
    value: string;
    onClick: () => void;
}

export function Box(props: BoxProps) {
    let classes = "grid-square-show";
    let content: any = props.value;

    if (props.value === "M") {
        content = (<img src={mineImg}/>);
        classes = "grid-square-mine";
    } else if (props.value === "H") {
        content = "";
        classes = "grid-square-hide";
    }

    return <div className={classes} style={{width: 20, height: 20, fontSize: "10px"}} onClick={props.onClick}>
        {content}
        </div>
}