module.exports = {
    get: function(input){
        let arg = input.substring(input.indexOf(' ') + 1);
        return arg;
    }
}