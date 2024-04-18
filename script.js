const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const hasilPencarian = document.getElementById("hasil");
const pagination = document.querySelector(".pagination");

const API_CLIENT_ID = "4Yu7vTHE6s1Uvij2Mdi0L1xLzEQ2Qs5QefjZjj5NwjA";
let currentPage = 1;

const calculateTotalPages = (userImgQuantity) => {
  if (userImgQuantity == 5) {
    return 50;
  } else if (userImgQuantity == 10) {
    return 20;
  } else {
    // Default pagination is 20 pages
    return 20;
  }
};

const generateImages = async (userPrompt, userImgQuantity, page = 1) => {
  try {
    // Tampilkan loading
    imageGallery.innerHTML = Array.from(
      { length: userImgQuantity },
      () => `
    <div class="img-card loading">
      <img src="images/loader.svg" alt="loading" />
    </div>
  `
    ).join("");

    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&query=${userPrompt}&per_page=${userImgQuantity}&client_id=${API_CLIENT_ID}&order_by=random`
    );

    const data = await response.json();

    console.log(data);

    if (data.results.length === 0) {
      // Tampilkan pesan jika gambar tidak ditemukan
      imageGallery.innerHTML = "<p>Gambar tidak ditemukan.</p>";
      return;
    }

    // Generate markup untuk setiap gambar dari respons API
    const imgCardMarkup = data.results
      .map(
        (photo) =>
          `
        <div class="img-card">
            <img src="${photo.urls.regular}" alt="${photo.alt_description}" />
            <a href="${photo.links.download}" target='_blank' class="download-btn">
              <img src="images/download.svg" alt="download icon" />
            </a>
        </div>
      `
      )
      .join("");

    // Tampilkan markup gambar di galeri gambar
    hasilPencarian.innerHTML = `Hasil Pencarian Dari ${userPrompt}`;
    setTimeout(() => {
      imageGallery.innerHTML = imgCardMarkup;
      // Tampilkan tombol pagination
      renderPagination(totalPages);
    }, 2000);

    // Update nomor halaman saat ini
    currentPage = page;

    // Tentukan jumlah total halaman berdasarkan userImgQuantity
    const totalPages = calculateTotalPages(userImgQuantity);
  } catch (error) {
    console.log(error);
  }
};

const renderPagination = (totalPages) => {
  let paginationButtons = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons += `<button class="page-btn" data-page="${i}">${i}</button>`;
  }
  pagination.innerHTML = paginationButtons;
};

const handlePaginationClick = (e) => {
  if (e.target.matches(".page-btn")) {
    const page = parseInt(e.target.dataset.page);
    generateImages(
      generateForm.elements[0].value,
      generateForm.elements[1].value,
      page
    );
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const userPrompt = e.target.elements[0].value;
  const userImgQuantity = e.target.elements[1].value;

  // Reset nomor halaman saat melakukan pencarian baru
  // currentPage = 1;

  if (userPrompt.length < 3) {
    alert("Kata pencarian harus memiliki minimal 3 huruf.");
    return;
  }

  generateImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmit);
pagination.addEventListener("click", handlePaginationClick);
