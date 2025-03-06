document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
        fetch("veg.json").then(response => response.json()).catch(error => console.error("Error loading veg.json:", error)),
        fetch("Nonveg.json").then(response => response.json()).catch(error => console.error("Error loading Nonveg.json:", error))
    ])
        .then(([vegData, nonvegData]) => {
            if (vegData) populateMenu(vegData, "vegetarian-menu");
            if (nonvegData) populateMenu(nonvegData, "nonvegetarian-menu");
        })
        .catch(error => console.error("Error fetching menu data:", error));
});

function populateMenu(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    const currentHour = new Date().getHours();

    data.forEach(dish => {
        if (!dish.category) return;

        const categoryClass = dish.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const dishElement = document.createElement("div");
        dishElement.classList.add("dish", categoryClass);

        const isAvailable = currentHour >= dish.startTime && currentHour < dish.endTime;
        const stars = generateStars(dish.rating);

        let shortDesc = dish.description.length > 50 ? dish.description.substring(0, 50) + "..." : dish.description;
        let fullDesc = dish.description;

        dishElement.innerHTML = `
            <i class="fa fa-circle" style="font-size:14px; color: ${dish.veg ? 'green' : 'red'};">
                <span class="${dish.veg ? 'vegetarian' : 'non-vegetarian'}">
                    ${dish.veg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                </span>
            </i>
            <div class="dish-content">
                <div class="dish-details">
                    <div class="dish-header">
                        <span class="dish-name">${dish.name}</span>
                    </div>
                    <div class="dish-pricing">
                        <span class="dish-price">Rs ${dish.price} </span>
                        <span class="original-price"> ${(dish.price * 1.2).toFixed(0)} </span>
                        <div class="offer">${dish.offer || ""}</div>
                    </div>
                    <span class="dish-rating">${stars} (${dish.rating})</span>
                    <p class="dish-description" 
                        data-full="${fullDesc}" 
                        data-short="${shortDesc}">
                        ${window.innerWidth < 480 ? shortDesc + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>' : fullDesc}
                    </p>
                </div>
            </div>
            <div class="dish-footer">
                <span class="tag" onclick="filterDishes('${categoryClass}')">${dish.category}</span>
                <button class="btn order-btn" 
                    onclick="selectDish('${dish.name} - Rs ${dish.price}', this)" 
                    ${isAvailable ? "" : "disabled"} 
                    style="${isAvailable ? "" : "opacity: 0.5; cursor: not-allowed;"}">
                    ${isAvailable ? "Add to Order" : "Available Soon"}
                </button>
            </div>
        `;

        container.appendChild(dishElement);
    });

    lazyLoadImages();
    handleReadMore();
}

function lazyLoadImages() {
    const lazyImages = document.querySelectorAll(".lazy-img");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("fade-in");
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

function handleReadMore() {
    if (window.innerWidth >= 480) return;

    document.querySelectorAll(".dish-description").forEach(desc => {
        let shortText = desc.getAttribute("data-short");
        let fullText = desc.getAttribute("data-full");

        desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';

        desc.addEventListener("click", function (event) {
            if (event.target.classList.contains("read-more")) {
                desc.innerHTML = fullText + ' <span class="read-less" style="color: #31B404; cursor: pointer;">Read Less</span>';
            } else if (event.target.classList.contains("read-less")) {
                desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';
            }
        });
    });
}

function handleResize() {
    document.querySelectorAll(".dish-description").forEach(desc => {
        let fullText = desc.getAttribute("data-full");
        let shortText = desc.getAttribute("data-short");

        if (window.innerWidth >= 480) {
            desc.innerHTML = fullText;
        } else {
            desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';
            handleReadMore();
        }
    });
}

window.addEventListener("resize", handleResize);
handleResize();

function filterDishes(category) {
    document.querySelectorAll(".dish").forEach(dish => {
        dish.style.display = category === "all" || dish.classList.contains(category) ? "block" : "none";
    });
}
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const currentHour = new Date().getHours();
        console.log("Current Hour:", currentHour); // Debugging line

        const buttons = document.querySelectorAll(".btn");

        if (currentHour < 7 || currentHour >= 23) {
            console.log("Restaurant is closed. Disabling buttons."); // Debugging line
            buttons.forEach(button => {
                button.disabled = true;
                button.style.opacity = "0.5";
                button.style.cursor = "not-allowed";
                button.textContent = "Restaurant Closed";
            });
        }
    }, 500); // Small delay to ensure elements exist
});


document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".btn");
    const currentHour = new Date().getHours();

    if (currentHour >= 23 || currentHour < 7) {
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = "0.5";
            button.style.cursor = "not-allowed";
        });
    }
});

fetch('header.json')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.restaurant-name').textContent = data.restaurantName;
        document.querySelector('.restaurant-details').textContent = `${data.address} | ${data.contact}`;
    })
    .catch(error => console.error('Error loading header data:', error));

function generateStars(rating) {
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 !== 0;
    let starHTML = "";
    for (let i = 0; i < fullStars; i++) {
        starHTML += `<i class="fa fa-star" style="color: gold;"></i> `;
    }
    if (halfStar) {
        starHTML += `<i class="fa fa-star-half" style="color: gold;"></i> `;
    }
    return starHTML;
}

function sendLocationOnWhatsApp() {
    if (!whatsappNumber) {
        alert("WhatsApp number not found. Please try again later.");
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Use Google Maps API to get a more readable address (optional)
            var locationURL = `https://maps.google.com/?q=${latitude},${longitude}`;
            var whatsappMessage = `This is my current location: ${locationURL}`;
            var whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappURL, '_blank');
        }, function (error) {
            alert("Unable to retrieve your location. Please enable location access.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}