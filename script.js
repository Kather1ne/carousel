const SLIDES_ON_MOBILE = 2.2;
const SLIDES_ON_DESKTOP = 5;
const SLIDES_GAP = 10;

let slidesOnScreen = 0;
let remainder = 0;

let slideWidth = 0;
let slidesLength = 0;
let carouselNavWidth = 0;
let currentIndex = 0;

function isMobile() {
  const mobileThreshold = 768;
  return window.innerWidth < mobileThreshold;
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}

function reset() {
  const carousel = document.querySelector(".carousel");
  const carouselNav = document.querySelector(".carousel-nav span");

  currentIndex = 0;

  carousel.style.transform = "translateX(0)";
  carouselNav.style.transform = "translateX(0)";
}

function updateSizes() {
  slidesOnScreen = isMobile() ? SLIDES_ON_MOBILE : SLIDES_ON_DESKTOP;
  remainder = slidesOnScreen - 1;

  const carouselContainer = document.querySelector(".carousel-container");
  const slides = document.querySelectorAll(".slide");

  const carouselContainerRec = carouselContainer.getBoundingClientRect();
  const carouselContainerWidth = parseInt(carouselContainerRec.width);

  const carouselNavContainer = document.querySelector(".carousel-nav");
  const carouselNav = document.querySelector(".carousel-nav span");

  const carouselNavRec = carouselNavContainer.getBoundingClientRect();
  carouselNavWidth = carouselNavRec.width;

  slidesLength = slides.length;
  slideWidth = carouselContainerWidth / slidesOnScreen - SLIDES_GAP;

  carouselNav.style.width =
    (carouselNavWidth / slidesLength) * slidesOnScreen + "px";

  slides.forEach((slide) => {
    slide.style.width = slideWidth + "px";
  });

  reset();
}

function init() {
  let startX;
  let touchDiff;

  const carousel = document.querySelector(".carousel");

  const carouselNavContainer = document.querySelector(".carousel-nav");
  const carouselNav = document.querySelector(".carousel-nav span");

  updateSizes();

  function getTranslateX() {
    const transform = window
      .getComputedStyle(carousel)
      .getPropertyValue("transform")
      .match(/(-?[0-9\.]+)/g);

    return transform ? Number(transform[4]) : 0;
  }

  function onDragStart(dragValue) {
    startX = dragValue;
  }

  function onDragEnd() {
    startX = null;

    touchDiff < 0 ? showNextSlide() : showPrevSlide();
  }

  function onDrag(dragValue) {
    if (!startX) return;

    const translateX = getTranslateX();
    const x = dragValue - startX;
    touchDiff = x;
    if (x < slideWidth) {
      carousel.style.transform = `translateX(${translateX + x}px)`;
    }
  }

  carousel.addEventListener("mousedown", function (e) {
    onDragStart(e.pageX);
    e.preventDefault();
  });

  carousel.addEventListener("mouseup", function () {
    carousel.style.cursor = "grab";
    onDragEnd();
  });

  carousel.addEventListener("mousemove", function (e) {
    onDrag(e.pageX);
  });

  carousel.addEventListener("touchstart", function (e) {
    onDragStart(e.touches[0].pageX);
  });

  carousel.addEventListener("touchmove", function (e) {
    onDrag(e.touches[0].pageX);
  });

  carousel.addEventListener("touchend", onDragEnd);

  function showSlide(index) {
    index = Math.round(index);
    carousel.style.transform = `translateX(-${index * (slideWidth + 10)}px)`;
    carouselNav.style.transform = `translateX(${
      (index * carouselNavWidth) / slidesLength
    }px)`;
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % (slidesLength - remainder);
    showSlide(currentIndex);
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1) % (slidesLength - remainder);
    currentIndex = currentIndex < 0 ? 0 : currentIndex;
    showSlide(currentIndex);
  }

  carouselNavContainer.addEventListener("click", showNextSlide);
}

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", debounce(updateSizes, 300));
