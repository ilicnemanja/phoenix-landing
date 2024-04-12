import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const container = document.getElementById('viewerContainer');

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// append id to renderer dom element
renderer.domElement.id = 'webgiCanvas';

// OrbitControls initialization
const controls = new OrbitControls(camera, renderer.domElement);
// disable zoom
controls.enableZoom = true;
// disable left click to rotate
controls.enableRotate = true;
//disable right click to pan
controls.enablePan = true;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xD3D4D8, 2.4);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// set background color to transaparent
renderer.setClearColor(0x000000, 0);

const tl = gsap.timeline();
const loader = new GLTFLoader();
let model;

loader.load(
    './assets/scene.gltf',
    function (gltf) {
        setTimeout(() => {
            document.body.classList.remove('no-scroll');
        }, 2500);

        model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        scene.add(model);

        // Adjust camera position
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Adjust camera position to fit the object
        const maxDim = Math.max(size.x, size.y, size.z);
        let cameraZ = (window.innerWidth <= 450) ? (maxDim * 1.22) : (window.innerWidth <= 768) ? maxDim : (window.innerWidth <= 991) ? (maxDim / 1.5) : (maxDim / 2);
        const cameraToCenterDistance = cameraZ / Math.tan(Math.PI / 180.0 * camera.fov / 2);
        camera.position.z = center.z + cameraToCenterDistance;
        camera.position.x = center.x;
        camera.position.y = center.y;

        // Look at the center of the object
        camera.lookAt(center);

        // Optional: Adjust controls target
        controls.target.copy(center);

        // Initialize scroll-triggered rotation
        initScrollAnimation(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only needed if camera should react to manual orbit control inputs
    renderer.render(scene, camera);
}

// Example function to initialize GSAP scroll-triggered animation
function initScrollAnimation(model) {
    gsap.to(model.rotation, {
        y: -1.6,
    });

    gsap.to(model.position, {
        x: -0.009,
        y: -0.01,
    });

    gsap.to(model.rotation, {
        x: 0.9,
        y: 0.6,
        scrollTrigger: {
            trigger: ".animation1",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
            onEnter: () => {
                gsap.to(".animation1", {opacity: 1, duration: 0.8});
                document.getElementById("viewerContainer").style.top = '0';
                document.getElementById("webgiCanvas").style.top = '0';
                document.getElementById("webgiCanvas").style.transition = 'top 0.5s';
            },
            onLeave: () => {
                gsap.to(".animation1", {opacity: 0, duration: 0.8});
                document.getElementById("webgiCanvas").style.transition = '';
            },
            onEnterBack: () => {
                gsap.to(".animation1", {opacity: 1, duration: 0.8});
                document.getElementById("webgiCanvas").style.top = '0';
                document.getElementById("webgiCanvas").style.transition = 'top 0.5s';
            },
            onLeaveBack: ({direction}) => {
                gsap.to(".animation1", {opacity: 0, duration: 0.8});
                document.getElementById("webgiCanvas").style.transition = '';
                document.getElementById("viewerContainer").style.top = window.innerHeight <= 800 ? '25%' : '18%';

                if (direction === -1) { // When scrolling back up
                    document.getElementById("webgiCanvas").style.top = window.innerHeight <= 800 ? '25%' : '18%';
                }
            },
        },
    });

    gsap.to('#viewerContainer', {
        opacity: window.innerWidth <= 991 ? 0.2 : 1,
        scrollTrigger: {
            trigger: '.animation1',
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false
        },
    });


    gsap.to(model.position, {
        y: 0.01,
        z: 0.2,
        scrollTrigger: {
            trigger: ".animation1",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.position, {
        x: 0,
        scrollTrigger: {
            trigger: ".animation1",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.rotation, {
        x: 0.75,
        y: 1.5,
        scrollTrigger: {
            trigger: ".animation2",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
            onEnter: () => {
                gsap.to(".animation2", {opacity: 1, duration: 0.8});
            },
            onLeave: () => {
                gsap.to(".animation2", {opacity: 0, duration: 0.8});
            },
            onEnterBack: () => {
                gsap.to(".animation2", {opacity: 1, duration: 0.8});
            },
            onLeaveBack: ({direction}) => {
                gsap.to(".animation2", {opacity: 0, duration: 0.8});
            },
        },
    });

    gsap.to(model.position, {
        x: -0.008,
        z: 0.3,
        scrollTrigger: {
            trigger: ".animation3",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
            onEnter: () => {
                gsap.to(".animation3", {opacity: 1, duration: 0.8});
            },
            onLeave: () => {
                gsap.to(".animation3", {opacity: 0, duration: 0.8});
            },
            onEnterBack: () => {
                gsap.to(".animation3", {opacity: 1, duration: 0.8});
            },
            onLeaveBack: ({direction}) => {
                gsap.to(".animation3", {opacity: 0, duration: 0.8});
            },
        },
    });

    gsap.to(model.rotation, {
        x: 0.65,
        scrollTrigger: {
            trigger: ".animation3",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.rotation, {
        x: 0,
        y: 1.6,
        scrollTrigger: {
            trigger: ".animation4",
            start: "top top",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to('.middle-section', {
        opacity: 0,
        scrollTrigger: {
            trigger: ".middle-section",
            start: "top center",
            end: "+=200",
            scrub: 2,
            immediateRender: false
        },
    });

    gsap.to('#viewerContainer', {
        opacity: 1,
        scrollTrigger: {
            trigger: ".animation4",
            start: "top top",
            scrub: 2,
            immediateRender: false
        },
    });

    gsap.to(model.position, {
        x: -0.01,
        z: window.innerWidth <= 450 ? 1.6 : window.innerWidth <= 768 ? 1.3 : window.innerWidth <= 991 ? 0.8 : 0.65,
        scrollTrigger: {
            trigger: ".animation4",
            start: "top top",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to('.animation5', {
        opacity: 1,
        scrollTrigger: {
            trigger: '.animation5',
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false
        },
    });

    gsap.to('.animation5', {
        ease: "none",
        scrollTrigger: {
            trigger: ".animation5",
            pin: true,
            start: "top top",
            end: "+=2500",
            scrub: 2,
        },
    });

    gsap.to('.animation5', {
        opacity: 0,
        scrollTrigger: {
            trigger: '.animation6',
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.position, {
        z: 0.1,
        scrollTrigger: {
            trigger: '.animation6',
            start: "top top",
            end: "bottom top",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.rotation, {
        x: 0.6,
        y: 2.4,
        scrollTrigger: {
            trigger: '.animation6',
            start: "top top",
            end: "bottom top",
            scrub: 2,
            immediateRender: false,
        },
    });

    gsap.to(model.position, {
        x: 0.06,
        scrollTrigger: {
            trigger: '.animation7',
            start: "top bottom",
            end: "top top",
            scrub: 2,
            immediateRender: false,
            onEnter: () => gsap.to(".animation7", {opacity: 1, duration: 0.8}),
            onLeave: () => gsap.to(".animation7", {opacity: 0, duration: 0.8}),
            onEnterBack: () => gsap.to(".animation7", {opacity: 1, duration: 0.8}),
            onLeaveBack: () => gsap.to(".animation7", {opacity: 0, duration: 0.8}),
        },
    });

    gsap.to(model.position, {
        x: window.innerWidth <=500 ? 0.02 : window.innerWidth <=620 ? 0.06 : window.innerWidth <=1200 ? 0.1 : 0.2,
        z: -0.5,
        scrollTrigger: {
            trigger: '.animation8',
            start: "top bottom",
            end: "top top",
            scrub: 2,
        },
    });

    gsap.to("#viewerContainer", {
        scrollTrigger: {
            trigger: ".animation8",
            start: "top bottom", // As `.animation8` starts entering from the bottom
            end: "bottom bottom", // Adjust this if needed to ensure it triggers at the end of `.animation8`
            scrub: true,
            immediateRender: false,
            onLeave: ({direction}) => {
                if (direction === 1) { // When scrolling down past animation8
                    // Set the viewerContainer to be positioned within the right-section
                    const viewerContainer = document.getElementById("viewerContainer");
                    viewerContainer.style.position = 'absolute';

                    const canva = document.getElementById("webgiCanvas");
                    canva.style.position = 'absolute';
                    canva.style.top = '-3%';
                    canva.style.left = '-12%';

                    // set body to overflow hidden for x
                    document.body.style.overflowX = 'hidden';
                }

                if (direction === -1) { // When scrolling back up into animation8
                    const canva = document.getElementById("webgiCanvas");
                    canva.style.position = 'fixed';
                    canva.style.top = '0';
                    canva.style.left = '0';
                }
            },
            onEnterBack: ({direction}) => {
                // When scrolling back up into animation8
                const canva = document.getElementById("webgiCanvas");
                canva.style.position = 'fixed';
                canva.style.top = '0';
                canva.style.left = '0';

                if (direction === -1) { // When scrolling back up into animation8
                    canva.style.top = window.innerHeight <= 800 ? '25%' : '18%';
                }
            },
            onLeaveBack: ({direction}) => {
                if (direction === 1) { // When scrolling down past animation8
                    const canva = document.getElementById("webgiCanvas");
                    canva.style.position = 'absolute';
                    canva.style.top = '-3%';
                    canva.style.left = '-12%';

                    // set body to overflow hidden for x
                    document.body.style.overflowX = 'hidden';
                }

                if (direction === -1) { // When scrolling back up into animation8
                    const canva = document.getElementById("webgiCanvas");
                    canva.style.position = 'fixed';
                    canva.style.top = '0';
                    canva.style.left = '0';
                }

            }
        }
    });

    gsap.to('#viewerContainer', {
        opacity: window.innerWidth <= 1200 ? 0.2 : 1,
        scrollTrigger: {
            trigger: ".animation8",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2,
            immediateRender: false,
        },
    });
}

animate();
