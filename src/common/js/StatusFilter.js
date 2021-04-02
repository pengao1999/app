function statusName(status) {
	//状态 1、待支付 2、待配送 3、配送中 4、已送达 5、已签收（已提货）6、已处理 7、待审核
  const statusMap = {
    unPay: '待支付',
    payFail: '支付失败',
    paySuccess: '待配送',
    sending: '配送中',
    arrive: '待自提',
    completed: '已完成',
    cancel: '已取消',
    returning: '售后待处理',
    returned: '已售后',
    shortage: '缺货取消',
	PROCESSED: '已处理',
	UNPROCESSED: '待审核'
  }
  return statusMap[status]
}

export default {
  statusName: statusName,
}
