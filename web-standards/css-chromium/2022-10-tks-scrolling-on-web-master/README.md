# TKS scrolling test on the web

This is a hacked version of TKS on the web.

Note that `node_modules` are included since I made a small change in the @bbkit node module


# To run this on the web

Run `$ npm run dev ` 

load `http://localhost:3000/` in your favorite browser

# Scrolling test
Run the following test with LayoutNG and legacy layout respectively.

1. Set Brower Zoom to 75%
2. Click on `Update Cell Values`
3. Click on `Scroll Test`
4. Wait for it to finish. It'll do two round trips of scrolling.

# Result
In my local testing, the Legacy Layout is 5-10% faster than LayoutNG
