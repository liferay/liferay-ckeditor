﻿var config=require("./bender");config.startBrowser=process.env.BROWSER||"Chrome";config.startBrowserOptions={Chrome:"--headless --disable-gpu",Firefox:"-headless"};module.exports=config;