import { loadAllItems, loadPromotions } from './Dependencies'
import { Data, Item } from './item'

export function printReceipt(tags: string[]): string {
  const items = getFinalItems(tags, loadAllItems())
  const text = render(items)

  return text
}

function render(items: Data[]): string {
  let total = 0
  let subTotal = 0
  const lines: string[] = []

  items.map(item => {
    const subtotal = item.isInPromotions ? item.item.price * (item.count - item.count % 2) : item.item.price * item.count
    lines.push(renderSingleItem(item, subtotal))
    subTotal += subtotal
    total += item.item.price * item.count
  })

  return `***<store earning no money>Receipt ***
${lines.join('\n')}
----------------------
Total：${subTotal.toFixed(2)}(yuan)
Discounted prices：${(total - subTotal).toFixed(2)}(yuan)
**********************`
}

function renderSingleItem(item: Data, subtotal: number): string {
  return `Name：${item.item.name}，Quantity：${item.count} ${item.item.unit}s，Unit：${item.item.price.toFixed(2)}(yuan)，Subtotal：${subtotal.toFixed(2)}(yuan)`
}

function getFinalItems(tags: string[], items: Item[]): Data[] {
  const itemsBuy: Item[] = []
  const tagsFiltered = tags
    .reduce((current, code) => current.includes(code.slice(0, 10)) ? current : [...current, code.slice(0, 10)], [tags[0]])

  tagsFiltered.map(tag => {
    for (let i = 0; i < items.length; i++) {
      if (tag === items[i].barcode)
        itemsBuy.push(items[i])
    }
  })

  const counts = getItemsCount(tags, tagsFiltered)
  const itemInPromotions = getBarcodeInPromotions(tagsFiltered, loadPromotions()[0].barcodes)
  const finalItems: Data[] = []

  itemsBuy.map((item, index) => finalItems.push({
    item: item,
    count: counts[index],
    isInPromotions: itemInPromotions[index]
  }))

  return finalItems
}

function getItemsCount(tags: string[], tagsFiltered: string[]): number[] {
  const itemsCount: number[] = []

  tagsFiltered.map(tag => {
    let count = 0
    for (let j = 0; j < tags.length; j++) {
      if (tags[j].includes(tag))
        tags[j].includes(tag) && tags[j].length > tag.length ? count += +tags[j].slice(11, tags[j].length) : count++
    }
    itemsCount.push(count)
  })

  return itemsCount
}

function getBarcodeInPromotions(tagsFiltered: string[], tagsInPromotions: string[]) {
  return tagsFiltered.map(tag => tagsInPromotions.toString().includes(tag))
}
