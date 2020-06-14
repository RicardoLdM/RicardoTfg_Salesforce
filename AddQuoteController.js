({
    doInit: function(component, event, helper) {
        
        component.find("quoteRecordCreator").getNewRecord(
            "Quote__c", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache
            $A.getCallback(function() {
                var rec = component.get("v.newQuote");
                var error = component.get("v.newQuoteError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                console.log("Record template initialized: " + rec.apiName);
            })
        );
    },

    handleSaveQuote: function(component, event, helper) {
       
            var d = new Date();
            d.setMonth(d.getMonth()+4)
            component.set("v.simpleNewQuote.OpportunityId", component.get("v.recordId"));
           
            component.find("quoteRecordCreator").saveRecord(function(saveResult) {
                var resultsToast = $A.get("e.force:showToast");
                if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                    
                    
                    
    				var redirect = $A.get("e.force:navigateToSObject");
                   	
                    redirect.setParams({
  					  "recordId": saveResult.recordId
             		});
    
                    resultsToast.setParams({
                        "title": "Creado.",
                        "message": "El registro ha sido guardado correctamente.",
                        "type": "success"
                    });
                    resultsToast.fire();
                    $A.get("e.force:closeQuickAction").fire();
					redirect.fire();

                } else if (saveResult.state === "INCOMPLETE") {
                    
                    console.log("User is offline, device doesn't support drafts.");
                } else if (saveResult.state === "ERROR") {
                    
                    resultsToast.setParams({
                        "title": "Error",
                        "message": /*component.get("v.newQuoteError")*/JSON.stringify(saveResult.error[0].message),
                        "type": "error"
                    });
                    resultsToast.fire();
                    
                    
                    console.log('Problem saving Quote, error: ' + JSON.stringify(saveResult.error));
                } else {
                    console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                }
            });
       
    }
})