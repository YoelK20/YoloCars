function currencyIDR (value){
    let data = value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
      });
    return data
}

module.exports = currencyIDR