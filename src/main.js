import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

const ti = document.getElementById("title");
const de = document.getElementById("desc");

gsap.registerPlugin(ScrollTrigger);

const sc = new THREE.Scene();

const cam = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

cam.position.set(0.18,2.63,11.84);

const ren = new THREE.WebGLRenderer({
    antialias: true
});

ren.setSize(window.innerWidth, window.innerHeight);
ren.setPixelRatio(window.devicePixelRatio);

ren.shadowMap.enabled = true;
ren.shadowMap.type = THREE.PCFShadowMap;
ren.domElement.style.position="fixed";
ren.domElement.style.top="0";
ren.domElement.style.left="0";
ren.domElement.style.zIndex="0";

document.body.appendChild(ren.domElement);
const pmrem = new THREE.PMREMGenerator(ren);

new EXRLoader().load("/hdri/garage.exr", (tex) => {

    const env = pmrem.fromEquirectangular(tex).texture;

    sc.environment = env;
    sc.background = env;
    sc.environmentIntensity = 0.34;

    tex.dispose();
    pmrem.dispose();

});

const ctrl = new OrbitControls(cam, ren.domElement);

ctrl.enableDamping = true;
ctrl.dampingFactor = 0.058;

ctrl.minDistance = 3;
ctrl.maxDistance = 25;

const amb = new THREE.AmbientLight(0xffffff, 1.2);
sc.add(amb);

const sun = new THREE.DirectionalLight(0xffffff, 5);

sun.position.set(7.84,11.73,8.18);
sun.castShadow = true;

sc.add(sun);



const ld = new GLTFLoader();

ld.load(
    "/models/e36.glb",

    (gltf) => {

        const car = gltf.scene;

        car.scale.set(1, 1, 1);
        car.position.set(0, 0, 0);

        car.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        sc.add(car);

        const box = new THREE.Box3().setFromObject(car);
        const cen = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        ctrl.target.copy(cen);

        cam.position.set(
            cen.x,
            cen.y + size.y * 0.6,
            cen.z + size.z * 3
        );

        ctrl.update();
      gsap.to(cam.position,{
     x:5,
     y:3,
     z:8,
     scrollTrigger:{
        trigger:document.body,
        start:"top top",
        end:"40% top",
        scrub:1
     }
});
    },

    undefined,

    (err) => console.error(err)

);

const h = new THREE.SpotLight(0xffffff,20,50,Math.PI/8,0.3);
h.position.set(0.12,0.84,3.06);
h.target.position.set(0,0.5,10);
sc.add(h);
sc.add(h.target);

const bm = new THREE.MeshBasicMaterial({color:0xff0000});

const l = new THREE.Mesh(
    new THREE.BoxGeometry(0.2,0.2,0.05),
    bm
);
l.position.set(-1,0.8,-2.8);

const r = l.clone();
r.position.x = 1;

sc.add(l);
sc.add(r);

const g = new THREE.BufferGeometry();
const p = [];

for(let i=0;i<1000;i++){
    p.push(
        Math.random()*20-10,
        Math.random()*10,
        Math.random()*20-10
    );
}

g.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(p,3)
);

const rn = new THREE.Points(
    g,
    new THREE.PointsMaterial({
        color:0xaaaaaa,
        size:0.05
    })
);



sc.add(rn);
const lg = new THREE.CylinderGeometry(0.097,0.126,9.37,18);

const lm = new THREE.MeshStandardMaterial({
    color:0x404040,
    roughness:0.817,
    metalness:0.713
});

const lp = new THREE.Mesh(lg,lm);

lp.position.set(-8.23,4.69,-5.41);
lp.castShadow=true;
lp.receiveShadow=true;

sc.add(lp);

const hg = new THREE.BoxGeometry(0.91,0.19,0.18);

const hm = new THREE.MeshStandardMaterial({
    color:0x353535,
    roughness:0.793,
    metalness:0.681
});

const hd = new THREE.Mesh(hg,hm);

hd.position.set(-7.76,9.28,-5.41);
hd.castShadow=true;
hd.receiveShadow=true;

sc.add(hd);

const bg = new THREE.SphereGeometry(0.094,17,17);

const blm = new THREE.MeshBasicMaterial({
    color:0xfff6c2
});

const bl = new THREE.Mesh(bg,blm);

bl.position.set(-7.33,9.24,-5.41);

sc.add(bl);

const sl = new THREE.SpotLight(
    0xfff2d8,
    27.6,
    38.4,
    0.624,
    0.437
);

sl.position.set(-7.33,9.24,-5.41);
sl.target.position.set(-7.18,0,-5.12);

sl.castShadow=true;

sc.add(sl);
sc.add(sl.target);

window.addEventListener("resize", () => {

    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();

    ren.setSize(window.innerWidth, window.innerHeight);

});

function animate(){

    requestAnimationFrame(animate);
    ctrl.update();
    rn.rotation.x += 0.002;
    ren.render(sc,cam);
}



ScrollTrigger.create({
    start:0,
    end:"max",
    onUpdate:s=>{

        const p = s.progress;

        if(p < 0.33){

            ti.textContent = "BMW E36";
            de.textContent = "The icon that defined a generation.";

            gsap.to("#ui",{
                x:0,
                y:0,
                duration:0.5
            });

        }

        else if(p < 0.66){

            ti.textContent = "INLINE 6";
            de.textContent = "189 HP • 245 Nm • Rear Wheel Drive";

            gsap.to("#ui",{
                x:450,
                y:-80,
                duration:0.5
            });

        }

        else{

            ti.textContent = "LEGACY";
            de.textContent = "One of BMW's most loved sports sedans.";

            gsap.to("#ui",{
                x:900,
                y:0,
                duration:0.5
            });

        }

    }
});
animate();

