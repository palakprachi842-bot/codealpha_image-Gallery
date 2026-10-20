
const images = [
  {
    title: "Mountain Escape",
    category: "nature",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900"
  },
  {
    title: "City Lights",
    category: "city",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900"
  },
  {
    title: "Wild Fox",
    category: "animals",
    url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900"
  },
  {
    title: "Ocean Dreams",
    category: "nature",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900"
  },
  {
    title: "Urban Architecture",
    category: "city",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900"
  },
  {
    title: "Majestic Deer",
    category: "animals",
    url: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=900"
  },
  {
    title: "Forest Adventure",
    category: "nature",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900"
  },
  {
    title: "New York Skyline",
    category: "city",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900"
  },
  {
    title: "Beautiful Butterfly",
    category: "animals",
    url: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=900"
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const imageCounter = document.getElementById("imageCounter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

let filteredImages = [...images];
let currentIndex = 0;
let lastFocusedElement = null;

// Display images in the gallery
function displayGallery() {
  gallery.innerHTML = "";

  filteredImages.forEach((image, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View ${image.title}`);

    item.innerHTML = `
      <img src="${image.url}" alt="${image.title}" loading="lazy">
      <div class="image-overlay">
        <h3>${image.title}</h3>
        <p>${image.category}</p>
      </div>
    `;

    item.addEventListener("click", () => openLightbox(index));

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    gallery.appendChild(item);
  });
}

// Filter images by category
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.filter;

    filteredImages = category === "all"
      ? [...images]
      : images.filter((image) => image.category === category);

    closeLightbox();
    displayGallery();
  });
});

// Open selected image
function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  currentIndex = index;

  updateLightbox();

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

// Update image, title and counter
function updateLightbox() {
  const image = filteredImages[currentIndex];

  lightboxImg.src = image.url;
  lightboxImg.alt = image.title;
  lightboxTitle.textContent = image.title;

  imageCounter.textContent =
    `${currentIndex + 1} / ${filteredImages.length}`;
}

// Next image
function nextImage() {
  currentIndex = (currentIndex + 1) % filteredImages.length;
  updateLightbox();
}

// Previous image
function previousImage() {
  currentIndex =
    (currentIndex - 1 + filteredImages.length) % filteredImages.length;

  updateLightbox();
}

// Close image viewer
function closeLightbox() {
  if (!lightbox.classList.contains("show")) return;

  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", previousImage);
closeBtn.addEventListener("click", closeLightbox);

// Close when clicking outside the image
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    nextImage();
  } else if (event.key === "ArrowLeft") {
    previousImage();
  } else if (event.key === "Tab") {
    const controls = [closeBtn, prevBtn, nextBtn];
    const index = controls.indexOf(document.activeElement);

    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      nextBtn.focus();
    } else if (!event.shiftKey && index === controls.length - 1) {
      event.preventDefault();
      closeBtn.focus();
    }
  }
});

// Initial gallery
displayGallery();
