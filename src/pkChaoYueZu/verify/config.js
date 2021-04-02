const server = process.env.VUE_APP_SERVER
const imgRoot = process.env.VUE_APP_IMG_ROOT

export default {
    SERVER: server,
    IMG_ROOT: imgRoot,
    REQUEST_URLS: {
        creditStatus: server + '/user/getCertificateStatus',            //获取用户认证状态
        creditLimit: server + '/credit/get',                            //获取授信额度
        idCardCredit: server + '/file/uploadIDCard',                    //用户身份证认证
        bandCardCredit: server + '/user/bankcard/add',                  //用户银行卡认证
        addBaseInfo: server + '/user/baseInfo/upsert',                  //添加用户基本信息
		addStudentInfo: server + '/user/student/upsert',				//添加用户学生信息
        addJobInfo: server + '/user/job/upsert',                        //添加用户工作信息
		addCompanyInfo: server + '/user/company/upsert',				//添加用户企业信息
        addContact: server + '/user/contact/addContact',                //添加用户紧急联系人
        getIdentityCode: server + '/sms/send',                          //获取短信验证码
        getBaseInfo: server + '/user/baseInfo/getBaseInfo',             //查询用户基本信息
        getStudentInfo: server + '/user/student/getStudentInfo',        //查询用户学生信息
        getJobInfo: server + '/user/job/getJobInfo',                    //查询用户工作信息
		getCompanyInfo: server + '/user/company/getCompanyInfo',        //查询用户企业信息
        getContact: server + '/user/contact/getContact',                //查询紧急联系人
        getBankCard: server + '/user/bankcard/get',                     //查询银行卡信息
        getFaceUrl: server + '/face/auth/getFaceUrl',                   //获取人脸识别跳转链接
        getFaceResult: server + '/face/auth/getFaceResult',             //获取人脸识别结果
        getPeriodSettingUsingGET: server + '/system/getPeriodSetting',  //获取租期
        uploadContact: server + '/data/contact/collect',                //上传通讯录数据
        crawlerData: server + '/risk/xingpang/crawlerData',             //爬取运营商数据
        appendData: server + '/risk/xingpang/appendData',               //填写验证码
        queryRentOrder: server + "rent/order/queryRentOrder",           //查询订单
		getOcrParams: server + "/idcard/ocr/getOcrParams",
		getFrontOcrImg: server + "/idcard/ocr/getFrontOcrImg",
		getBackOcrImg: server + "/idcard/ocr/getBackOcrImg",
		idCardVerify: server + "/idcard/ocr/idCardVerify",
		getRepairItems: server + "/repair/item",                        //维修项目
		repairOrder: server + "/repair/saveOrder",                            //保存订单
    },
    UPLOAD_LIMIT: 6 * 1000 * 1000,  //单位B
    COMM_LIST: [
        '请选择',
        '是',
        '否'
    ],
    DEGREE_LIST: [
        '请选择',
        '高中',
        '大专',
        '本科'
    ],
    MARRIAGE_LIST: [
        '请选择',
        '未婚',
        '已婚',
    ],
    INDUSTRY_LIST: [
        '请选择',
        '农、林、牧、渔业',
        '制造业',
        '建筑业',
        '住宿和餐饮业',
        '信息传输、软件和信息技术服务业',
        '金融业',
        '教育',
        '文化、体育和娱乐业',
    ],
    BANK_LIST: [
        '请选择开户行',
        '中国工商银行',
        '中国农业银行',
        '中国银行',
        '中国建设银行',
        '交通银行',
        '招商银行',
        '中信银行',
        '中国民生银行',
        '中国邮政储蓄银行',
        '华夏银行',
        '中国光大银行',
    ],
    DAY_LIST: ['请选择', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
	HOUSING_LIST: ['请选择','商品房','动迁房','经济适用房','老工房','自建房','别墅','其他'],
	LIVINGTYPE_LIST: ['请选择','自有','亲属','租房','宿舍','其他']
}
