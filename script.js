const mealsEl = document.getElementById('meals')
const favoriteContainer = document.getElementById('fav-meals')
const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')
const mealPopup = document.getElementById('meal-popup')
const mealInfoEl = document.getElementById('meal-info')
const popupCloseBtn = document.getElementById('close-popup')

getRandomMeal()
fetchFavMeals()

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const responseData = await response.json()
    const randomMeal = responseData.meals[0]

    addMeal(randomMeal, true)
}

async function getMealById(id) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
    const responseData = await response.json()
    const meal = responseData.meals[0]
    return meal
}

async function getMealBySearch(term) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
    const responseData = await response.json()
    const meals = responseData.meals
    return meals
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div')
    meal.classList.add('meal')
    
    meal.innerHTML = `
        <div class="meal-header">
            ${random ? `
            <span class="random">
                Prato aleatório
            </span>` : ''}
            
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `

    const btn = meal.querySelector('.meal-body .fav-btn')

    const mealInfo = meal.querySelector('.meal-header img') 

    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal)
            btn.classList.remove('active')
        } else {
            addMealLS(mealData.idMeal)
            btn.classList.toggle('active')
        }

        fetchFavMeals()
    })

    mealInfo.addEventListener('click', () => {
        showMealinfo(mealData)
    })
    
    mealsEl.appendChild(meal)
}

function addMealLS(mealId) {
    const mealIds = getMealsLS()
    
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS()

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))

    return mealIds === null ? [] : mealIds
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = ''
    
    const mealIds = getMealsLS()

    for(let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i]
        meal = await getMealById(mealId)

        addMealFav(meal)
    }

}

function addMealFav(mealData, random = false) {
    const favMeal = document.createElement('li')
    
    favMeal.innerHTML = `
        <li>
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            <span>${mealData.strMeal}</span>
        </li>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `

    const btn = favMeal.querySelector('.clear')

    const mealInfo = favMeal.querySelector('img')

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal)
        btn.parentElement.remove()
    })

    mealInfo.addEventListener('click', () => {
        showMealinfo(mealData)
    })

    favoriteContainer.appendChild(favMeal)
}

function showMealinfo(mealData) {
    // clean the container
    mealInfoEl.innerHTML = ''
    
    // update the popup with the meal info
    const mealEl = document.createElement('div')

    const ingredients = []
    
    // get ingredients and measures
    for(let i = 1; i <= 20; i++) {
        if(mealData['strIngredient' + i]) {
            ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
        } else {
            break
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <p>${mealData.strInstructions}</p>
        <h3>Ingredientes:</h3>
        <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
    `

    mealInfoEl.appendChild(mealEl)

    // show the popup
    mealPopup.classList.remove('hidden')
}

searchBtn.addEventListener('click', async () => {
    // clean the container
    mealsEl.innerHTML = ''
    
    const search = searchTerm.value
    let snackbar = document.getElementById("snackbar")
    
    getMealBySearch(search)

    const meals = await getMealBySearch(search)

    if(meals) {
        meals.forEach(meal => {
            addMeal(meal)
        })
    } else {
        // snackbar
        snackbar.className = "show";
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
})

popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden')
})