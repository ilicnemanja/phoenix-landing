document.addEventListener('DOMContentLoaded', (event) => {
    let swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        slidesPerView: 'auto', // Use 'auto' to allow slides with different widths
        centeredSlides: true,
        grabCursor: true,
        spaceBetween: 100, // Adjust as needed
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: ".swiper-pagination",
        },
        // mousewheel: {
        //     releaseOnEdges: true,
        // },
    });// Ensure the custom navigation elements control the swiper instance

    const leftArrow = document.querySelectorAll('.left-arrow');
    const rightArrow = document.querySelectorAll('.right-arrow');

    leftArrow.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            swiper.slidePrev();
        });
    });

    rightArrow.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            swiper.slideNext();
        });
    });
});

const element = document.getElementById('mobile-slide');
if(window.innerWidth > 768) {
    element.remove();
}

document.querySelectorAll('.swiper-slide').forEach((slide) => {
    slide.style.width = '1280px'; // Enforce width in JS, if needed
});