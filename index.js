require('dotenv').config()
const fs = require('fs')
const _ = require('lodash')

const inputPath = process.env.INPUT_PATH
const outPath = process.env.OUTPUT_PATH
const fileNames = []

function loadFileNames() {
	return new Promise((resolve, reject) => {
		fs.readdir(process.env.INPUT_PATH, (err, names) => {
			if (err) reject(err)

			names.forEach((name) => {
				fileNames.push(name)
			})

			resolve()
		})
	})
}

async function getFileContent(index) {
	return new Promise((resolve, reject) => {
		fs.readFile(inputPath + '/' + fileNames[index], 'utf-8', (err, data) => {
			if (err) reject(err)

			resolve(data)
		})
	})
}

async function saveResults(fileName, data) {
	const strData = JSON.stringify(data)
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, strData, (err) => {
			if (err) reject(err)

			resolve()
		})
	})
}

async function getLinesFromFile(fileContents) {
	return fileContents.split(/\r?\n/)
}

function getDateFromFileName(fileName) {
	return fileName.split(/ANDR/g)[0].trim()
}

function matchAsistenciaLine(line) {
	return line
		.trim()
		.split(/.*From\s*([0-9]{9}|[0-9]{8})\s*((\w\s?)*)\:\s*PRESENTE$/gm)
		.filter((s) => s !== '')
}

function countTotalBy(data, propertyName = 'control') {
	const results = _.countBy(data, propertyName)
	return results
}

async function main() {
	try {
		await loadFileNames()
		const results = []
		const wrongFormat = []

		for (let i = 0; i < fileNames.length; i++) {
			const fileName = fileNames[i]
			const fileContents = await getFileContent(i)
			const lines = await getLinesFromFile(fileContents)

			const date = getDateFromFileName(fileName)

			for (const line of lines) {
				const regResult = matchAsistenciaLine(line)
				if (regResult.length == 1) {
					wrongFormat.push(line)
					continue
				}

				const asistencia = {
					fecha: date,
					control: regResult[0].trim(),
					nombre: regResult[1].trim(),
				}

				results.push(asistencia)
			}
		}
		const countResults = countTotalBy(results, 'control')
		await saveResults(`${outPath}/result${new Date().getTime()}.json`, {
      countResults,
      wrongFormat,
			data: results,
		})
	} catch (error) {
		console.log('Error', error.message)
	}
}

main()
