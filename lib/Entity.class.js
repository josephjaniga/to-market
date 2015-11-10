class Entity{
    constructor(options){
        this.components = [];
        this.Update = ()=>{
            for ( var i=0; i<this.components.length; i++ ){
                this.components[i].Update();
            }
        };
        this.Draw = ()=>{
            for ( var i=0; i<this.components.length; i++ ){
                this.components[i].Draw();
            }
        };
        this.getComponentByName = (name)=>{
            var needle = null;
            for (var i=0; i<this.components.length; i++){
                if ( this.components[i].name === name ){
                    needle = this.components[i];
                    break;
                }
            }
            return needle;
        };
        this.buildEntityLiteral = ()=>{
            // build position
            var p = {x:0, y:0},
                s = {w:0, h:0},
                r = {
                    type: "DEFAULT",
                    image: "DEFAULT_FILE.JPG",
                    color: "#000000"
                },
                transform = this.getComponentByName("Transform"),
                renderer = this.getComponentByName("Renderer");
            if ( transform !== null ){
                p = transform.position;
                s = transform.size;
            }
            if ( renderer !== null ){
                r = renderer.getLiteral();
            }
            return {
                position: p,
                size: s,
                renderer: r
            };
        };
    }
}

module.exports = Entity;