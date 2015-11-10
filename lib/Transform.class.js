import Component from "./Component.class";

export default class Transform extends Component{
    constructor(options){
        super(options);
        this.name = "Transform";
        this.position = {x: 0, y: 0};
        this.size = {w: 0, h: 0};
    }
}