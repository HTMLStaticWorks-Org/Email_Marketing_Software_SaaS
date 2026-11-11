/* ==========================================================================
   MailFlow jQuery AJAX Demo Mock Layer
   Supports AJAX interactions cleanly over both http:// and file:// protocols.
   ========================================================================== */

(function (window, $) {
  'use strict';

  function mockAjaxRequest(endpoint, payload) {
    const deferred = $.Deferred();

    // Use jQuery's $.ajaxPrefilter / $.ajaxTransport pattern via simulated async JSON response
    setTimeout(() => {
      const response = {
        ok: true,
        demo: true,
        endpoint: endpoint,
        timestamp: new Date().toISOString(),
        data: payload || {}
      };
      deferred.resolve(response);
    }, 260);

    return deferred.promise();
  }

  // Register jQuery prefilter so real $.ajax({ url: '/api/demo/...' }) works offline & on file://
  if ($ && $.ajaxTransport) {
    $.ajaxTransport('+*', function (options) {
      if (options.url && options.url.indexOf('/api/demo/') === 0) {
        return {
          send: function (headers, completeCallback) {
            setTimeout(function () {
              let parsedBody = {};
              try {
                parsedBody = typeof options.data === 'string' ? JSON.parse(options.data) : (options.data || {});
              } catch (e) {
                parsedBody = { raw: options.data };
              }
              completeCallback(200, 'OK', {
                json: {
                  ok: true,
                  demo: true,
                  endpoint: options.url,
                  timestamp: new Date().toISOString(),
                  echo: parsedBody
                }
              });
            }, 240);
          },
          abort: function () {}
        };
      }
    });
  }

  function ajaxPost(endpoint, payload) {
    if ($ && $.ajax) {
      return $.ajax({
        url: '/api/demo/' + endpoint.replace(/^\/+/, ''),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(payload || {})
      });
    }
    return mockAjaxRequest(endpoint, payload);
  }

  window.MailFlowAjax = {
    post: ajaxPost
  };
})(window, window.jQuery);

