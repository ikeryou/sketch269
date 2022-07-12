
import { MyDisplay } from "../core/myDisplay";
import { Param } from "../core/param";
import { Util } from "../libs/util";
import { Visual } from "./visual";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _v:Visual;

  constructor(opt:any) {
    super(opt)

   this._v =  new Visual({
      el:this.getEl()
    })
  }


  protected _update(): void {
    super._update();

    const zoomer = document.body.clientWidth / window.innerWidth;
    this._v.rate = Util.instance.map(zoomer, 0, 1, 1, 5);

    // (document.querySelector('.l-debug') as HTMLElement).innerHTML = '' + zoomer
    Param.instance.zoom = zoomer;
  }
}