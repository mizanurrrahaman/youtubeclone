export const publicidx = (publicid) => {
    let urlArr = publicid.split("/")
    let firstValue = urlArr [urlArr.length - 2]
    let lastValue = urlArr [urlArr.length - 1].split(".")[0]
    let finalId = firstValue + "/" + lastValue 
    return finalId 
}

// publicidx("https://res.cloudinary.com/dpnhor2qr/image/upload/v1720700355/user/course_1674372625_yo2co4.jpg")