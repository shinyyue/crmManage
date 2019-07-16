// 新后台API地址
export const API_ROOT =
    (process.env.NODE_ENV === 'production') ?
        'https://portal.futurefertile.com/' : 'https://dev.portal.futurefertile.com/'

// IM
export const IM_API_ROOT =
    (process.env.NODE_ENV === 'production') ? 'wss://portal.futurefertile.com/im/' : 'wss://dev.portal.futurefertile.com/im/'
