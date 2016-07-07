/*@Service*/
module.exports = {
    /*@Autowired("browserDao")*/
    browserDao: null,
    browserShare: function(param) {
        var pc = this.browserDao.browserShare(param, 'pc'),
            mobile = this.browserDao.browserShare(param, 'mobile'),
            list = [pc, mobile];
        return Promise.all(list).then(function(data) {
            return data;
        });
    }
};
