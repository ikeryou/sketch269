import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { Util } from '../libs/util';
import { Param } from '../core/param';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Object3D> = [];

  private _cmnGeo:PlaneGeometry;
  private _cmnMat:MeshBasicMaterial;
  private _cmnMat2:MeshBasicMaterial;

  public rate:number = 0;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    // 共通の作っておく
    this._cmnGeo = new PlaneGeometry(1,1);
    this._cmnMat = new MeshBasicMaterial({
      color:0xFFF304,
      transparent:true,
      depthTest:false
    })
    this._cmnMat2 = new MeshBasicMaterial({
      color:0xC54D66,
      transparent:true,
      depthTest:false
    })

    for(let i = 1; i < 50; i++) {
      const parent = new Object3D();
      this._con.add(parent);
      this._item.push(parent);
      parent.visible = false;

      this._makeMesh(i, parent);
    }

    this._resize();
  }


  private _makeMesh(col:number, tg:Object3D): void {

    const baseSize = 1;
    const offset = 0.8;
    const size = baseSize / col
    const num = col * col;
    for(let i = 0; i < num; i++) {
      const ix = i % col;
      const iy = ~~(i / col);

      const m = new Mesh(this._cmnGeo, Util.instance.randomArr([this._cmnMat, this._cmnMat2]));
      tg.add(m);

      m.scale.x = size * offset;
      m.scale.y = size * offset;

      m.position.x = size * 0.5 + ix * size - baseSize * 0.5
      m.position.y = -size * 0.5 - iy * size + baseSize * 0.5
    }
  }


  protected _update(): void {
    super._update();

    const zoom = Param.instance.zoom;

    // const s = Math.min(Func.instance.sw() * zoom, Func.instance.sh() * zoom);
    const s = 300 * (1 / zoom);
    this._con.scale.set(s, s, 1)

    const now = ~~(Util.instance.map(this.rate, 0, this._item.length - 1, 0, 1))
    this._item.forEach((val,i) => {
      val.visible = (now == i);
    })

    if (this.isNowRenderFrame()) {

      const w = Func.instance.sw() * zoom;
      const h = Func.instance.sh() * zoom;

      this.renderSize.width = w;
      this.renderSize.height = h;

      this.updateCamera(this.camera, w, h);

      let pixelRatio: number = window.devicePixelRatio || 1;
      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(w, h);
      // this.renderer.clear();

      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x155673, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }
}
