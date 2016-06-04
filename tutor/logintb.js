/**
 * taobao login
# java -Dwebdriver.chrome.driver="E:/opensource/selenium/chromedriver.exe" -jar selenium.jar -role node -hub http://192.168.7.7:4545/grid/register
# java -jar selenium.jar -role hub -port 4545
 *
 */
 
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

try{
	driver.get('http://www.baidu.com');
	driver.findElement(By.id('kw')).sendKeys('selenium webdriver');
	driver.findElement(By.id('su')).click();
	driver.wait(until.titleIs('selenium webdriver_百度搜索'), 2000);
}
finally{
	driver.quit();
}
