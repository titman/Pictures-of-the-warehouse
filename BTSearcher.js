require('HTMLParser,NSMutableArray,TFHpple,BTItem,NSString,NSArray');

defineClass('HTMLParser', {}, {

    parsingWithObject_sourceName: function(object, sourceName) {

        if (sourceName.isEqualToString("BTAnb")) {

            return HTMLParser.BTAnb(object);

        } else if (sourceName.isEqualToString("BTKiki")) {

            return HTMLParser.BTKiki(object);

        } else if (sourceName.isEqualToString("BTURLs")) {

            return HTMLParser.BTURLs(object);
        }

        return null;
    },

    parsingMagnetWithObject_sourceName: function(object, sourceName) {

        if (sourceName.isEqualToString("BTAnb")) {

        } else if (sourceName.isEqualToString("BTKiki")) {

            return HTMLParser.BTKikiMagnet(object);
            
        } else if (sourceName.isEqualToString("BTURLs")) {

            return HTMLParser.BTURLsMagnet(object);
        }

        return null;
    },

    BTURLs: function(object) {

        var result = NSMutableArray.array();

        var hpple = TFHpple.alloc().initWithHTMLData(object);

        var mlistElements = hpple.searchWithXPathQuery("//ul[@class = 'mlist']");

        for (var a = 0; a < mlistElements.count(); a++) {

            var mlistElement = mlistElements.objectAtIndex(a);
            
            var liElements = mlistElement.searchWithXPathQuery("//li");
            
            for (var b = 0; b < liElements.count(); b++) {

                var liElement = liElements.objectAtIndex(b);

                var item = BTItem.alloc().init();

                var h3Elements = liElement.searchWithXPathQuery("//h3[@class = 'T1']");

                for (var c = 0; c < h3Elements.count(); c++) {

                    var h3Element = h3Elements.objectAtIndex(c);

                    var tmpString = h3Element.raw().stringByReplacingOccurrencesOfString_withString("<span class=\"highlight\">", "");

                    tmpString = tmpString.stringByReplacingOccurrencesOfString_withString("</span>", "");

                    tmpString = tmpString.stringByReplacingOccurrencesOfString_withString("\n", "");

                    var hppleTmp = TFHpple.alloc().initWithHTMLData(tmpString.dataUsingEncoding(4));

                    var aElements = hppleTmp.searchWithXPathQuery("//a");

                    for (var d = 0; d < aElements.count(); d++) {

                        var aElement = aElements.objectAtIndex(d);

                        item.setTitle(aElement.text());
                        item.setHref("http://www.bturls.net" + aElement.objectForKey("href").toJS());
                    }
                }



                var itemListElements = liElement.searchWithXPathQuery("//div[@class = 'item-list']");

                var files = NSMutableArray.array();

                for (var e = 0; e < itemListElements.count(); e++) {

                    var itemListElement = itemListElements.objectAtIndex(e);

                    files.addObject(itemListElement.text());
                }

                item.setFiles(files);


                var dtElements = liElement.searchWithXPathQuery("//dt");

                for (var f = 0; f < dtElements.count(); f++) {

                    var dtElement = dtElements.objectAtIndex(f);

                    var spanElements = dtElement.searchWithXPathQuery("//span");

                    for (var g = 0; g < spanElements.count(); g++) {

                        var spanElement = spanElements.objectAtIndex(g);

                        if (g == 0) item.setDate("创建日期：" + spanElement.text().toJS());
                        if (g == 1) item.setSize("文件大小：" + spanElement.text().toJS());
                        if (g == 2) item.setFileCount("热度：" + spanElement.text().toJS());
                    }
                }

                result.addObject(item);
            }
        }

        return result;
    },

    BTURLsMagnet: function(object) {
        var hpple = TFHpple.alloc().initWithHTMLData(object);

        var resultElements = hpple.searchWithXPathQuery("//dl[@class = 'BotInfo']");

        for (var a = 0; a < resultElements.count(); a++) {

            var resultElement = resultElements.objectAtIndex(a);
            
            var aElements = resultElement.searchWithXPathQuery("//a");
            
            for (var i = 0; i < aElements.count(); i++) {

                var aElement = aElements.objectAtIndex(i);

                return aElement.objectForKey("href");
            }
        }

        return null;
    },


    BTKiki: function(object) {

        var result = NSMutableArray.array();

        var hpple = TFHpple.alloc().initWithHTMLData(object);

        var resultElements = hpple.searchWithXPathQuery("//div[@id = 'result']");

        for (var a = 0; a < resultElements.count(); a++) {

            var resultElement = resultElements.objectAtIndex(a);
            
            var gElements = resultElement.searchWithXPathQuery("//div[@class = 'g']");
            
            for (var b = 0; b < gElements.count(); b++) {

                var gElement = gElements.objectAtIndex(b);

                var item = BTItem.alloc().init();

                var aElements = gElement.searchWithXPathQuery("//a");

                for (var c = 0; c < aElements.count(); c++) {

                    var aElement = aElements.objectAtIndex(c);

                    item.setTitle(aElement.objectForKey("title"));
                    item.setHref(aElement.objectForKey("href"));
                }

                var stdElements = gElement.searchWithXPathQuery("//div[@class = 'std']");

                for (var d = 0; d < stdElements.count(); d++) {

                    var stdElement = stdElements.objectAtIndex(d);

                    var multipleFiles = NSMutableArray.alloc().init();

                    var multipleFilesElements = stdElement.searchWithXPathQuery("//div[@class = 'list']");

                    for (var e = 0; e < multipleFilesElements.count(); e++) {

                        var multipleFilesElement = multipleFilesElements.objectAtIndex(e);

                        multipleFiles.addObject(multipleFilesElement.text());
                    }

                    item.setFiles(multipleFiles);
                }


                var std2Elements = gElement.searchWithXPathQuery("//div[@class = 'std2']");

                for (var f = 0; f < std2Elements.count(); f++) {

                    var std2Element = std2Elements.objectAtIndex(f);

                    var spanElements = std2Element.searchWithXPathQuery("//span");

                    for (var g = 0; g < spanElements.count(); g++) {

                        var spanElement = spanElements.objectAtIndex(g);

                        if (g == 0) item.setSize("文件大小：" + spanElement.text().toJS());
                        else if (g == 1) item.setFileCount("文件数：" + spanElement.text().toJS());
                        else if (g == 2) item.setDate("创建日期：" + spanElement.text().toJS());
                    }
                }

                result.addObject(item);
            }
        }

        return result;
    },

    BTKikiMagnet: function(object) {
        var hpple = TFHpple.alloc().initWithHTMLData(object);

        var resultElements = hpple.searchWithXPathQuery("//div[@id = 'result']");

        for (var a = 0; a < resultElements.count(); a++) {

            var resultElement = resultElements.objectAtIndex(a);
            
            var groupElements = resultElement.searchWithXPathQuery("//div[@class = 'list-group']");

            for (var b = 0; b < groupElements.count(); b++) {

                var groupElement = groupElements.objectAtIndex(b);

                var aElements = groupElement.searchWithXPathQuery("//a");
            
                for (var c = 0; c < aElements.count(); c++) {

                    var aElement = aElements.objectAtIndex(b);

                    return aElement.text();
                }
            }
        }

        return null;
    },

    BTAnb: function(object) {
        var result = NSMutableArray.array();


        var hpple = TFHpple.alloc().initWithHTMLData(object);

        var itemElements = hpple.searchWithXPathQuery("//div[@class = 'search-item']");

        for (var a = 0; a < itemElements.count(); a++) {

            var itemElement = itemElements.objectAtIndex(a);
            
            var item = BTItem.alloc().init();
            
            var tmpString = itemElement.raw().stringByReplacingOccurrencesOfString_withString("<span class=\"highlight\">", " ");
            tmpString = tmpString.stringByReplacingOccurrencesOfString_withString("<span>", " ");
            tmpString = tmpString.stringByReplacingOccurrencesOfString_withString("</span>", " ");
            tmpString = tmpString.stringByReplacingOccurrencesOfString_withString("\n", "");
            
            var hppleTmp = TFHpple.alloc().initWithHTMLData(tmpString.dataUsingEncoding(4));
            
            var titleElements = hppleTmp.searchWithXPathQuery("//div[@class = 'item-title']");
            
            for (var b = 0; b < titleElements.count(); b++) {

                var titleElement = titleElements.objectAtIndex(b);

                var aElements = titleElement.searchWithXPathQuery("//a");

                for (var c = 0; c < aElements.count(); c++) {

                    var aElement = aElements.objectAtIndex(c);

                    item.setTitle(aElement.text());
                    item.setHref("http://www.btanb.com" + aElement.objectForKey("href").toJS());
                }
            }
            
            
            var listElements = hppleTmp.searchWithXPathQuery("//div[@class = 'item-list']");
            
            for (var d = 0; d < listElements.count(); d++) {

                var listElement = listElements.objectAtIndex(d);

                var pElements = listElement.searchWithXPathQuery("//p");

                for (var e = 0; e < pElements.count(); e++) {

                    var pElement = pElements.objectAtIndex(e);

                    item.setFiles(NSArray.arrayWithObject(pElement.text()));
                }
            }
             
            var barElements = hppleTmp.searchWithXPathQuery("//div[@class = 'item-bar']");
            
            for (var f = 0; f < barElements.count(); f++) {

                var barElement = barElements.objectAtIndex(f);

                var blueElements = barElement.searchWithXPathQuery("//b[@class = 'cpill blue-pill']");

                for (var g = 0; g < blueElements.count(); g++) {

                    var blueElement = blueElements.objectAtIndex(g);

                    item.setDate("最后活跃：" + blueElement.text().toJS());
                    break;
                }

                var yellowElements = barElement.searchWithXPathQuery("//b[@class = 'cpill yellow-pill']");

                for (var h = 0; h < yellowElements.count(); h++) {

                    var yellowElement = yellowElements.objectAtIndex(h);

                    if (h == 0) item.setFileCount("热度：" + yellowElement.text().toJS());
                    if (h == 1) item.setSize("文件大小：" + yellowElement.text().toJS());
                }

                var aElements = barElement.searchWithXPathQuery("//a");

                for (var i = 0; i < aElements.count(); i++) {

                    var aElement = aElements.objectAtIndex(i);

                    var href = aElement.objectForKey("href");
                    item.setMagnet(href);
                    break;
                }

            }
            
            result.addObject(item);
        }

        return result;
    }
});
