var pageslideDirective = angular.module("pageslide-directive", []);

pageslideDirective.directive('pageslide', [
    function (){
        var defaults = {};

        /* Return directive definition object */

        return {
            restrict: "EA",
            replace: false,
            transclude: false,
            scope: {
                psOpen: "=?"
            },
            link: function ($scope, el, attrs) {
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* parameters */
                var param = {};
                param.side = attrs.pageslide || 'top';
                param.speed = attrs.psSpeed || '0.5';
                param.size = attrs.psSize || '50%';
                param.className = attrs.psClass || 'ng-pageslide';

                /* DOM manipulation */
                //console.log(el);
                var content = null;
                if (el.children() && el.children().length) {
                    content = el.children()[0];  
                } else {
                    content = (attrs.href) ? document.getElementById(attrs.href.substr(1)) : document.getElementById(attrs.psTarget.substr(1));
                }
                //console.log(content);
                // Check for content
                if (!content) 
                    throw new Error('You have to elements inside the <pageslide> or you have not specified a target href');
                var slider = document.createElement('div');
                slider.className = param.className;

                /* Style setup */
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.zIndex = 1000;
                slider.style.position = 'fixed';
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.transitionProperty = 'width, height';

                if(param.side=='top'){
                    
                        slider.style.width = attrs.psCustomWidth || '100%';   
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                }


                /* Append */
                document.body.appendChild(slider);
                slider.appendChild(content);

                /* Closed */
                function psClose(slider,param){
                    if (slider.style.width !== 0 && slider.style.width !== 0){
                        content.style.display = 'none';
                        if(param.side=='top'){
                                slider.style.height = '0px'; 
                        }
                    }
                    $scope.psOpen = false
                }

                /* Open */
                function psOpen(slider,param){
                    if (slider.style.width !== 0 && slider.style.width !== 0){
                        if (param.side=='top'){
                            
                                slider.style.height = param.size; 
                        }
                        setTimeout(function(){
                            content.style.display = 'block';
                        },(param.speed * 1000));

                    }
                }

                /*
                * Watchers
                * */

                $scope.$watch("psOpen", function (value){
                    if (!!value) {
                        // Open
                        psOpen(slider,param);
                    } else {
                        // Close
                        psClose(slider,param);
                    }
                });

                // close panel on location change
                if(attrs.psAutoClose){
                    $scope.$on("$locationChangeStart", function(){
                        psClose(slider, param);
                    });
                    $scope.$on("$stateChangeStart", function(){
                        psClose(slider, param);
                    });
                }

                /*
                * Events
                * */

                $scope.$on('$destroy', function() {
                    document.body.removeChild(slider);
                });

                var close_handler = (attrs.href) ? document.getElementById('close') : null;
                if (el[0].addEventListener) {
                    el[0].addEventListener('click',function(e){
                        e.preventDefault();
                        psOpen(slider,param);                    
                    });

                    if (close_handler){
                        close_handler.addEventListener('click', function(e){
                            e.preventDefault();
                            psClose(slider,param);
                        });
                    }
                } else {
                    // IE8 Fallback code
                    el[0].attachEvent('onclick',function(e){
                        e.returnValue = false;
                        psOpen(slider,param);                    
                    });

                    if (close_handler){
                        close_handler.attachEvent('onclick', function(e){
                            e.returnValue = false;
                            psClose(slider,param);
                        });
                    }
                }

            }
        };
    }
]);
