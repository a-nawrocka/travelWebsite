// const controller = new ScrollMagic.Controller();

// const exploreScene = new ScrollMagic.Scene({
// 	triggerElement: ".hike-explore",
// 	triggerHook: 0.5
// })
// .addIndicators({ colorStart: "white", colorTrigger: "white" })
// .addTo(controller);
let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
	// init Controller
	controller = new ScrollMagic.Controller();
	const sliders = document.querySelectorAll(".slide");
	const nav = document.querySelector(".nav-header");
	//loop over each slide
	sliders.forEach((slide, index, slides) => {
		const revealImg = slide.querySelector(".reveal-img");
		const img = slide.querySelector("img");
		const revealText = slide.querySelector(".reveal-text");
		// GSAP
		// gsap.to(revealImg, 1, {x: "100%"});
		const slideTimeline = gsap.timeline({
			defaults: { duration: 1, ease: "power2.inOut" }
		});
		slideTimeline.fromTo(revealImg, { x: "0%" }, { x: "100%" });
		slideTimeline.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
		slideTimeline.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
		// slideTimeline.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
		// Create scene
		slideScene = new ScrollMagic.Scene({
			triggerElement: slide,
			triggerHook: 0.25,
			reverse: false
		})
			.setTween(slideTimeline)
			.addIndicators({ colorStart: "white", colorTrigger: "white", name: "slide" })
			.addTo(controller);
		// New Animation
		const pageTimeline = gsap.timeline();
		let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
		pageTimeline.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
		pageTimeline.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
		pageTimeline.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
		// create new scene
		pageScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: "100%",
			triggerHook: 0
			// duration 100% mean the whole height of the slide
		})
			.setPin(slide, { pushFollowers: false })
			.setTween(pageTimeline)
			.addIndicators({ colorStart: "white", colorTrigger: "white", name: "page", indent: 200 })
			.addTo(controller)
	});
}

const mouse = document.querySelector(".cursor");
const mouseTxt = document.querySelector(".cursor-text");
const burger = document.querySelector(".burger");

function cursor(e) {
	mouse.style.top = e.pageY + "px";
	mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
	const item = e.target;
	if (item.id === "logo" || item.classList.contains("burger")) {
		mouse.classList.add("nav-active");
	} else {
		mouse.classList.remove("nav-active");
	}

	if (item.classList.contains("explore")) {
		mouse.classList.toggle("explore-active");
		gsap.to(".title-swipe", 1, { y: "0%" })
		mouseTxt.innerText = "tap";
	} else {
		mouse.classList.remove("explore-active");
		mouseTxt.innerText = "";
		gsap.to(".title-swipe", 1, { y: "100%" })
	}
}

function navToggle(e) {
	if (!e.target.classList.contains(".active")) {
		e.target.classList.add(".active");
		gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
		gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
		gsap.to("#logo", 1, { color: "black" })
		gsap.to(".nav-bar", 1, { clipPath: "circle(3000px at 100% -10%)" });
		document.body.classList.add("hide");
	} else {
		e.target.classList.remove(".active");
		gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to("#logo", 1, { color: "white" })
		gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
		document.body.classList.remove("hide");
	}
}
// Barba page transitions
const logo = document.querySelector("#logo");

barba.init({
	views: [
		{
			namespace: "home",
			beforeEnter() {
				animateSlides();
				logo.href = "./index.html"
			},
			beforeLeave() {
				slideScene.destroy();
				pageScene.destroy();
				controller.destroy();
			}
		},
		{
			namespace: "fashion",
			beforeEnter() {
				logo.href = "../index.html"
				detailAnimation();
			},
			beforeLeave() {
				controller.destroy();
				detailScene.destroy();
			}
		}
	],
	transitions: [
		{
			leave({ current, next }) {
				let done = this.async();
				// scroll to the top
				// window.scrollTo(0, 0);
				//animation
				const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
				timeline.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
				timeline.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%", onComplete: done }, "-=0.5");
			},
			enter({ current, next }) {
				let done = this.async();
				// scroll to the top
				window.scrollTo(0, 0);
				const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
				timeline.fromTo(".swipe", 1, { x: "0%" }, { x: "100%", stagger: 0.25, onComplete: done });
				timeline.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
				timeline.fromTo(".nav-header", 1, { y: "-100%" }, { y: "0%", ease: "power2.inOut" }, "-=1.5");
			}
		}
	]
})

function detailAnimation() {
	controller = new ScrollMagic.Controller();
	const slides = document.querySelectorAll(".detail-slide");
	slides.forEach((slide, index, slides) => {
		const slideTimeline = gsap.timeline({ defaults: { duration: 1 } });
		let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
		const nextImg = nextSlide.querySelector("img");
		slideTimeline.fromTo(slide, { opacity: 1 }, { opacity: 0 });
		slideTimeline.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
		slideTimeline.fromTo(nextImg, { x: "50" }, { x: "0%" });
		// Scene
		detailScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: "100%",
			triggerHook: 0
		}).setPin(slide, { pushFollowers: false }).setTween(slideTimeline).addIndicators({ colorStart: "white", colorTrigger: "white", name: "detailScene" }).addTo(controller);
	});
}
// Event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
