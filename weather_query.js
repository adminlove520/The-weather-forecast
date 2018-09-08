let input_partentNode = document.body.querySelector(".search_city")
let input_node = input_partentNode.querySelector("input")
let Weather_box_Node = document.body.querySelector(".Weather_box")
let Weather_now_Node = Weather_box_Node.querySelector(".Weather_now")
let hours_Weather_Node = Weather_box_Node.querySelector(".hours_Weather")
let Future_Weather_Node = Weather_box_Node.querySelector(".Future_Weather")


function get(url, callback, str) {
  let xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.onload = () => {
    let data = JSON.parse(xhr.responseText).HeWeather6
    if (data[0].status === "ok") {
      if (str === "add") {
        let ul = input_partentNode.querySelector("ul")
        if (ul) input_partentNode.removeChild(ul)
        callback(data[0].basic)
      } else if (str !== "add") {
        callback(data[0])
      }
    }
  }
  xhr.send()
}


input_node.oninput = (e) => {
  let ul = input_partentNode.querySelector("ul")
  if (input_node.value.length === 0 && ul) input_partentNode.removeChild(ul)
  let url = "https://search.heweather.com/find?location=" + input_node.value + "&key=42a2e74944864db5aec770a991481f7b"
  url += "&mode=match&number=10&group=cn"
  get(url, add_searchNode, "add") 
}

function add_searchNode(data) {      
  let ul = document.createElement("ul")
  let maxwidth = [0,0,0]
  ul.innerHTML = `<li><span>城市(镇)</span><span>上级城市</span><span>省份(城市属性)</span></li>`
  data.forEach((item) => {
    let li = document.createElement("li")
    li.cid = item.cid
    li.className = "cid"
    let city_data = [item.location, item.parent_city, item.type === "city" ? item.admin_area : "风景区" ]
    for (let i = 0; i < 3; i++) {
      let span = document.createElement("span")
      span.innerHTML = city_data[i]
      li.appendChild(span)
    }
    login_mouseenter(li)
    ul.appendChild(li)
  })
  ul.style.visibility = "hidden"
  input_partentNode.appendChild(ul)
  for (let i = 0; i < ul.children.length; i++) {
    for (let j = 0; j < 3; j++) if (ul.children[i].children[j].offsetWidth > maxwidth[j]) maxwidth[j] = ul.children[i].children[j].offsetWidth
  }
  for (let i = 0; i < ul.children.length; i++) {
    for (let j = 0; j < 3; j++) ul.children[i].children[j].style.width = maxwidth[j] + 30 + "px"
  }
  ul.style.visibility = "visible"
}

function login_mouseenter(node) {
  node.onmouseenter = (e) => {
      let url1 = "https://free-api.heweather.com/s6/weather/now?location=" + e.target.cid + "&key=42a2e74944864db5aec770a991481f7b"
      let url2 = "https://free-api.heweather.com/s6/weather/hourly?location=" + e.target.cid + "&key=42a2e74944864db5aec770a991481f7b"
      let url3 = "https://free-api.heweather.com/s6/weather/forecast?location=" + e.target.cid + "&key=42a2e74944864db5aec770a991481f7b"
      get(url1,Weather_now,"weather")
      get(url2,hours_Weather,"hours_Weather")
      get(url3,Future_Weather,"Future_Weather")
  }
}

function Weather_now(data) {
 Weather_now_Node.querySelector("img").src = `./weather_icon/${data.now["cond_code"]}.png`
 Weather_now_Node.querySelector("div span:nth-of-type(1)").innerHTML = data.basic.location + " " + data.update.loc
 Weather_now_Node.querySelector("div span:nth-of-type(2)").innerHTML = "天气：" + data.now.cond_txt
 Weather_now_Node.querySelector("div span:nth-of-type(3)").innerHTML = "温度：" + data.now.tmp + "℃"
}

function hours_Weather(data) {
  for (let i = 0; i < 8; i++) {
    let node = hours_Weather_Node.querySelector(`div:nth-of-type(${i + 1})`)
    node.querySelector("img").src = `./weather_icon/${data.hourly[i]["cond_code"]}.png`
    node.querySelector("div span:nth-of-type(1)").innerHTML = data.hourly[i].time
    node.querySelector("div span:nth-of-type(2)").innerHTML = "天气：" + data.hourly[i].cond_txt
    node.querySelector("div span:nth-of-type(3)").innerHTML = "温度：" + data.hourly[i].tmp + "℃"
  }
}

function Future_Weather(data) {
 for (let i = 0; i < 3; i++) {
  let node = Future_Weather_Node.querySelector(`div:nth-of-type(${i + 1})`)
  node.querySelector("img").src = `./weather_icon/${data["daily_forecast"][i]["cond_code_d"]}.png`
  node.querySelector("div span:nth-of-type(1)").innerHTML = data["daily_forecast"][i].date
  node.querySelector("div span:nth-of-type(2)").innerHTML = "天气：" + data["daily_forecast"][i].cond_txt_d
  node.querySelector("div span:nth-of-type(3)").innerHTML = "温度：" + data["daily_forecast"][i].tmp_max + "℃"
 }
 Weather_box_Node.style.display = "block"
}