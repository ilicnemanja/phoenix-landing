const HOST_URL = "https://phoenix-consultancy.io";

initialize();

async function initialize() {
  try {
    await loadSections();
    setContactForm();
    setSearchForm();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function loadSections() {
  const headerResponse = await fetch("/sections/header.html");
  const headerData = await headerResponse.text();
  document.getElementsByClassName("nav-container")[0].innerHTML = headerData;
  navItemColorChange();

  const footerResponse = await fetch("/sections/footer.html");
  const footerData = await footerResponse.text();
  document.getElementsByClassName("footer")[0].innerHTML = footerData;
}

function navItemColorChange() {
  const url = window.location.href;
  const navBarItems = document.querySelectorAll(".nav-link");
  const currentPage = url.split("/").pop();

  navBarItems.forEach((item) => {
    item.classList.remove("active");
    if (
      item.innerHTML == "Home" &&
      (currentPage == "" || currentPage == "#services")
    ) {
      item.classList.add("active");
    }
    if (item.innerHTML.toLowerCase() == currentPage) {
      item.classList.add("active");
    }
  });
}

function setContactForm() {
  const contactForm = document.querySelector("#contact-form");

  const messageEle = document.getElementById("message");
  const counterEle = document.getElementById("counter");
  if (messageEle) {
    messageEle.addEventListener("input", function (e) {
      const target = e.target;

      // Get the `maxlength` attribute
      const maxLength = target.getAttribute("maxlength");

      // Count the current number of characters
      const currentLength = target.value.length;

      counterEle.innerHTML = `${currentLength}/${maxLength}`;

      if (currentLength < 10) {
        messageEle.closest("div").children[2].style.display = "block";
        messageEle.closest("div").children[2].innerHTML =
          "Your message must be at least 10 characters long";
        messageEle.style.borderColor = "red";
      } else if (currentLength >= 500) {
        messageEle.closest("div").children[2].style.display = "block";
        messageEle.closest("div").children[2].innerHTML =
          "You have reached the maximum message length";
      }
    });
  }
  if (contactForm) {
    const inputs = document.querySelectorAll(".form-control");
    const sendBtn = document.querySelector(".send-btn");

    // Check if input empty on blur for each input.
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id === "org-name") continue;
      if (inputs[i].id === "telephone") continue;
      inputs[i].addEventListener("blur", function () {
        if (
          this.value === "" ||
          (this.id === "message" && this.value.length < 10)
        ) {
          this.closest("div").children[2].style.display = "block";
          this.style.borderColor = "red";
        } else {
          this.closest("div").children[2].style.display = "none";
          this.style.borderColor = "#ced4da";
        }
      });
      inputs[i].addEventListener("keypress", function () {
        this.closest("div").children[2].style.display = "none";
        this.style.borderColor = "#ced4da";
      });
    }

    function resetForm() {
      sendBtn.children[0].classList.remove("d-none");
      sendBtn.children[1].classList.add("d-none");
    }

    const toastsCloseBtns = document.querySelectorAll(".toast-close-btn");

    toastsCloseBtns.forEach((e) => {
      e.addEventListener("click", () => resetForm());
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      sendBtn.children[0].classList.add("d-none");
      sendBtn.children[1].classList.remove("d-none");

      const data = {
        fullName: document.querySelector("#fullName").value,
        org: document.querySelector("#orgName").value || null,
        email: document.querySelector("#email").value,
        telephone: document.querySelector("#telephone").value || null,
        message: document.querySelector("#message").value,
      };

      // Send data to server.
      fetch(HOST_URL + "/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          resetForm();
          document
            .querySelector(".contact-form-result")
            .classList.remove("d-none");
          document.querySelector(".contact-form-page").classList.add("d-none");
          document.querySelector(".footer").classList.add("footer-special");

          // Hide all previous errors.
          document.querySelectorAll(".form-control").forEach((input) => {
            input.closest("div").children[3].style.display = "none";
          });

          // Scroll to top.
          window.scrollTo(0, 0);

          if (res.success) {
            resetForm();
            document.querySelector(".sent-success").classList.remove("d-none");
          } else {
            resetForm();
            document.querySelector(".sent-failed").classList.remove("d-none");

            res.errors.forEach((e) => {
              const field = document.querySelector(`#${e.param}`);

              field.closest("div").children[3].style.display = "block";
            });
          }
        })
        .catch((err) => {
          resetForm();
          document
            .querySelector(".contact-form-result")
            .classList.remove("d-none");
          document.querySelector(".contact-form-page").classList.add("d-none");
          document.querySelector(".footer").classList.add("footer-special");
          document.querySelector(".sent-failed").classList.remove("d-none");

          // Scroll to top.
          window.scrollTo(0, 0);
        });
    });
  }
}

function setSearchForm() {
  const searchForm = document.querySelector("#search-form");

  function fetchProjects(searchKey) {
    fetch(HOST_URL + "/projects/" + searchKey)
      .then((res) => res.json())
      .then((res) => {
        const resultContainer = document.querySelector(".results-container");

        if (res.length === 0) {
          resultContainer.innerHTML =
            '<h2 class="fw-bold search-title mb-0">Your search yielded no results</h2>';
        } else {
          let resultHTML =
            '<h2 class="fw-bold search-title mb-0">Search results</h2>';
          const resultCardTemplate = (title, url) => `
            <div class="search-results">
              <a href="${url}">
                <h3 class="search-results-title text-primary fw-bold mb-0">
                  ${title}
                </h3>
              </a>
            </div>`;

          res.forEach((project) => {
            resultHTML += resultCardTemplate(project.name, project.url);
          });

          resultContainer.innerHTML = resultHTML;
        }
      });
  }

  if (searchForm) {
    const key = new URL(location.href).searchParams.get("search");

    if (key) {
      console.log(key);
      fetchProjects(key);
    }

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const searchKey = document.querySelector(
        "#search-form .search_input"
      ).value;

      fetchProjects(searchKey);
    });

    const searchIcon = document.querySelector("#search-form .fa-search");

    searchIcon.addEventListener("click", () => {
      searchForm.dispatchEvent(new Event("submit"));
    });
  }

  window.onload = () => {
    const navSearchForm = document.querySelector("#nav-search-form");
    const navSearchIcon = document.querySelector("#nav-search-form .fa-search");
    const navSearchInput = document.querySelector(
      "#nav-search-form .search_input.nav-input"
    );

    if (navSearchForm) {
      navSearchIcon.addEventListener("click", () => {
        window.location = "/search?search=" + navSearchInput.value;
      });
    }
  };

  // // Navbar search functionality.
  // function hideNavLinks() {
  //   const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  //   navLinks.forEach((link) => {
  //     link.style.display = 'none';
  //   });
  // }
  // function showNavLinks() {
  //   const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  //   navLinks.forEach((link) => {
  //     link.style.display = 'block';
  //   });
  // }
  // const navSearchForm = document.querySelector('#nav-search-form');

  // if (navSearchForm) {
  //   navSearchForm.addEventListener('submit', function (e) {
  //     e.preventDefault();
  //     hideNavLinks();

  //     const searchInput = document.querySelector('.search_input.nav-input');
  //     const searchKey = searchInput.value;
  //     const navResultContainer = document.querySelector(
  //       '.nav-search-results-container'
  //     );

  //     searchInput.addEventListener('keyup', function () {
  //       if (this.value === '') {
  //         showNavLinks();
  //         navResultContainer.style.display = 'none';
  //       }
  //     });

  //     fetch(HOST_URL + '/projects/' + searchKey)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         navResultContainer.style.display = 'block';
  //         if (res.length === 0) {
  //           navResultContainer.innerHTML =
  //             '<h2 class="fw-bold search-title mb-0 nav-search-title">Your search yielded no results</h2>';
  //         } else {
  //           let resultHTML =
  //             '<h2 class="fw-bold search-title mb-0 nav-search-title">Search results</h2>';
  //           const resultCardTemplate = (title, description, url) => `
  //             <div class="search-results">
  //               <a href="${url}">
  //                 <h3 class="search-results-title text-primary fw-bold mb-0">
  //                   ${title}
  //                 </h3>
  //               </a>
  //               <p class="search-results-subTitle">
  //                 ${description}
  //               </p>
  //             </div>`;

  //           res.forEach((project) => {
  //             resultHTML += resultCardTemplate(
  //               project.name,
  //               project.description,
  //               project.url
  //             );
  //           });

  //           navResultContainer.innerHTML = resultHTML;
  //         }
  //       });
  //   });
  // }

  // const navbar = document.querySelector(".nav-container");

  // window.addEventListener("scroll", function (e) {
  //   const lastPosition = window.scrollY;
  //   if (lastPosition > 30) {
  //     navbar.classList.add("active-nav");
  //   } else if (navbar.classList.contains("active-nav")) {
  //     navbar.classList.remove("active-nav");
  //   } else {
  //     navbar.classList.remove("active-nav");
  //   }
  // });

  if (document.querySelector("body > .container")) {
    document
      .querySelector("body > .container")
      .addEventListener("click", function () {
        document.getElementById("navbarNav").classList.remove("show");
        document
          .querySelector(".navbar-toggler")
          .setAttribute("aria-expanded", false);
      });
  }

  document
    .querySelectorAll(".navbar-nav li:not(:first-child)")
    .forEach((element) => {
      element.addEventListener("click", function () {
        document.getElementById("navbarNav").classList.remove("show");
        document
          .querySelector(".navbar-toggler")
          .setAttribute("aria-expanded", false);
      });
    });

  document
    .querySelector(".navbar-toggler-icon")
    .addEventListener("click", function () {
      document
        .querySelector(".navbar-toggler")
        .setAttribute("aria-expanded", true);
    });
}
