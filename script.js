const meals = document.getElementById('meals')

getRandomMeal()

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const responseData = await response.json()
    const randomMeal = responseData.meals[0]

    addMeal(randomMeal, true)
}

async function getMealById() {
    const meal = await fetch('www.themealdb.com/api/json/v1/1/lookup.php?i=52772'+id)
}

async function getMealBySearch() {
    const meals = await fetch('www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata'+term)
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

    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal)
            btn.classList.remove('active')
        } else {
            addMealLS(mealData.idMeal)
            btn.classList.toggle('active')
        }
    })

    meals.appendChild(meal)
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS()

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function addMealLS(mealId) {
    const mealIds = getMealsLS()

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))

    return mealIds === null ? [] : mealIds
}