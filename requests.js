
//TODO: this is a basic structure of what's needed for the cluster jewel request. needs work to convert to js
// interface TradeRequest {
//   query: {
//     status: { option: 'online' | 'onlineleague' | 'any' }
//     name?: string | { discriminator: string, option: string }
//     type?: string | { discriminator: string, option: string }
//     stats: Array<{
//       type: 'and' | 'if' | 'count' | 'not'
//       value?: FilterRange
//       filters: Array<{
//         id: string
//         value?: {
//           min?: number
//           max?: number
//           option?: number | string
//         }
//         disabled?: boolean
//       }>
//       disabled?: boolean
//     }>
//     filters: {
//       misc_filters?: {
//         filters: {
//           ilvl?: FilterRange
//         }
//       }
//     }
//   }
//   sort: {
//     price: 'asc'
//   }
// }