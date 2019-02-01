const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname,{
    	electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}

let mainWindow 
let newProductWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
    	app.quit();
    });
});

function createNewProduct() {
	newProductWindow = new BrowserWindow({
		width: 400,
		height: 330,
		title: 'Agregar un producto nuevo'
	});

	// newProductWindow.setMenu(null);

	newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }))
    newProductWindow.on('closed', () => {
    	newProductWindow = null;
    });
}

ipcMain.on('product:new', (e, newProduct) => {
	mainWindow.webContents.send('product:new', newProduct);
	newProductWindow.close();
});

const templateMenu = [
    {
        label: 'Archivos',
        submenu: [
        	{
        		label: 'Nuevo producto',
        		accelerator: process.plataform == 'darwin' ? 'command+N' : 'Ctrl+N',
                click(){
                    createNewProduct();
                }
        	},
        	{
        		label: 'Remover todo',
                click(){
                	mainWindow.webContents.send('products:remove-all');
                }
        	},
        	{
        		label: 'Exit',
                accelerator: process.plataform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]     
    }
];

if (process.platform == 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    })
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'Herramientas',
        submenu: [
            {
                label: 'Mostrar/Ocultar',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
    ]
    })
}