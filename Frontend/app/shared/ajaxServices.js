app.service('AjaxService', ['$http', '$q', function ($http, $q) {
    var promiseCount = 0;
    var promises = [];
    var Response = { index: 0, data: null, requestLength: 0 };
    this.post = function (url, params) {
        var deferredPromise = $q.defer();
        promises.push(deferredPromise);
        return $http({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: params,
            timeout: deferredPromise.promise
        });
    };

    this.getWithHeaders = function (url,accessToken) {
        var deferredPromise = $q.defer();
        promises.push(deferredPromise);
        return $http({
            method: 'GET',
            url: url,
            headers: {
                'x-access-token':accessToken
            },
            timeout: deferredPromise.promise
        });
    };

    this.postWithHeaders = function (url, params, accessToken) {
        var deferredPromise = $q.defer();
        promises.push(deferredPromise);
        return $http({
            method: 'POST',
            url: url,
            headers: {
               'x-access-token':accessToken
            },
            data: params,
            timeout: deferredPromise.promise
        });
    };

    this.postForm = function (url, params) {
        var deferredPromise = $q.defer();
        promises.push(deferredPromise);
        return $http({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param(params),
            timeout: deferredPromise.promise
        });
    };

    this.get = function (url) {
        var deferredPromise = $q.defer();
        promises.push(deferredPromise);
        return $http({
            method: 'GET',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            timeout: deferredPromise.promise
        });
    };
    this.abort = function () {
        for (var index = 0; index < promises.length; index++) {
            promises[index].resolve();
        }
        promises.length = 0;
    }
    this.postInBulk = function (requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback) {
        recquestsToBeProcessed = requestCollection.length > recquestsToBeProcessed ? recquestsToBeProcessed : requestCollection.length;
        for (var index = currentRequestCount; index < requestCollection.length; index++) {
            promise = this.post(requestCollection[index].url, requestCollection[index].data);
            promiseCount++;
            currentRequestCount++;
            (function (index) {
                promise.then(function (response) {
                    Response.index = index;
                    Response.data = response.data;
                    Response.requestLength = requestCollection.length;
                    if (successCallback)
                        successCallback(Response);
                    promiseCount--;
                    if (promiseCount === 0 && currentRequestCount < requestCollection.length)
                        this.postInBulk(requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback);
                }, function () {
                    promiseCount--;
                    Response.index = index;
                    Response.data = null;
                    Response.requestLength = requestCollection.length;
                    if (failureCallback)
                        failureCallback(Response);
                });
            })(index);
        }
    }

    this.postInBulkWithCustomHeaders = function (requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback, RequestHeaders, isFullLoad) {
        recquestsToBeProcessed = requestCollection.length > recquestsToBeProcessed ? recquestsToBeProcessed : requestCollection.length;
        for (var index = currentRequestCount; index < requestCollection.length; index++) {
            promise = this.postWithHeaders(requestCollection[index].url, requestCollection[index].data, RequestHeaders);
            promiseCount++;
            currentRequestCount++;
            (function (index) {
                promise.then(function (response) {
                    Response.index = index;
                    Response.data = response.data;
                    Response.requestLength = requestCollection.length;
                    if (successCallback)
                        successCallback(Response, isFullLoad);
                    promiseCount--;
                    if (promiseCount === 0 && currentRequestCount < requestCollection.length)
                        this.postInBulk(requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback, RequestHeaders);
                }, function () {
                    promiseCount--;
                    Response.index = index;
                    Response.data = null;
                    Response.requestLength = requestCollection.length;
                    if (failureCallback)
                        failureCallback(Response, isFullLoad);
                });
            })(index);
        }
    }

    this.getInBulk = function (requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback) {
        recquestsToBeProcessed = requestCollection.length > recquestsToBeProcessed ? recquestsToBeProcessed : requestCollection.length;
        for (var index = currentRequestCount; index < requestCollection.length; index++) {
            promise = this.get(requestCollection[index].url);
            promiseCount++;
            currentRequestCount++;
            (function (index) {
                promise.then(function (response) {
                    Response.index = index;
                    Response.data = response.data;
                    Response.requestLength = requestCollection.length;
                    if (successCallback)
                        successCallback(Response);
                    promiseCount--;
                    if (promiseCount === 0 && currentRequestCount < requestCollection.length)
                        this.getInBulk(requestCollection, recquestsToBeProcessed, currentRequestCount, successCallback, failureCallback);
                }, function () {
                    promiseCount--;
                    Response.index = index;
                    Response.data = null;
                    Response.requestLength = requestCollection.length;
                    if (failureCallback)
                        failureCallback(Response);
                });
            })(index);
        }
    }
}]);