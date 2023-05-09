module.exports = {
    setLocals: function (req, res, next) {
        if (req.user) {
            res.locals.user = req.user;
        }
        next();
    },
    checkAuth: function (req, res, next) {
        try {
            const reqUrl = req.url.split("/")?.[req.url.split("/").length - 1]; 
            console.log("reqUrl =>", reqUrl);
            
            // when user click on email-verification link can't check authentication
            const isNotEmailVerifyRoute = (reqUrl != "email-verification");
            
            if (!req.user && isNotEmailVerifyRoute) {
                console.log("------- User not authenticate--------");
                return res.redirect("/signin")
            }
            console.log("-------- User authenticate ----------");
            console.log("auth user =>", req.user);
            return next();
        } catch (error) {
            console.log("error =>", error);
            res.redirect("/login");
        }
    }
};

