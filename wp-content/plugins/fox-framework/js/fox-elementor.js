jQuery( document ).ready(function() {
    
    if ( ! jQuery( '.behavior-thumbnail-youtube-player' ).length ) {
        return;
    }
    if ( ! jQuery( '.thumbnail-youtube-player' ).length ) {
        return;
    }
    
    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    
        jQuery( '.thumbnail-youtube-player' ).each(function() {

            var player,
                self = jQuery( this ),
                youtubeid = self.data( 'youtubeid' ),
                placement = self.find( '.thumbnail-inner' ).find( '.yt-placement' )

            if ( ! placement.length ) {
                self.find( '.thumbnail-inner' ).prepend( '<div class="yt-placement" />' )
                placement = self.find( '.thumbnail-inner' ).find( '.yt-placement' )
            }

            if ( ! placement.attr( 'id' ) ) {
                placement.attr( 'id', 'yt-' + Date.now() )
            }

            var placement_id = placement.attr( 'id' )

            player = new YT.Player( placement_id, {
                videoId: youtubeid,
                height: 720,
                width: 1280,
                events: {
                    onReady: onPlayerReady, 
                    onStateChange: onPlayerStateChange
                }
            });

            function onPlayerReady(event) {

                self.data( 'player', player )
                self.on( 'click', function(e) {
                    event.target.setVolume(0);
                    event.target.playVideo();
                    self.addClass( 'played' );
                    setTimeout( function(){
                        event.target.setVolume(3);  
                    }, 300 )
                })
                self.find( '.thumbnail-inner' ).fitVids()

            }
            function onPlayerStateChange(event) {}

        })

    }
    
});

( function( $ ) {
    
    /**
     * Youtube API load for video playing
     */
    $( window ).on( 'elementor/frontend/init', function() {
        
        if ( ! jQuery( '.behavior-thumbnail-youtube-player' ).length ) {
            return;
        }
        if ( ! jQuery( '.thumbnail-youtube-player' ).length ) {
            return;
        }
        
        // only load when we have player button available
        var tag = document.createElement( 'script' );
        tag.id = 'iframe-demo';
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
    })
    
    /**
     * BUTTON BEHAVIOUR
     */
    $( window ).on( 'elementor/frontend/init', function() {
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/fox_btn.default', function( $scope, $ ) {
        
            $( document ).on( 'click', '.btn-popup', function( e ) {
                e.preventDefault()

                var self = $( this ),
                    popup_selector = self.data( 'popup' )

                if ( ! $( popup_selector ).length ) {
                    return
                }

                $( 'html' ).addClass( 'openning-popup' )
                $( popup_selector ).addClass( 'showing' )

            });

            $( document ).on( 'click', '.el-popup-overlay', function( e ) {
                e.preventDefault()

                var self = $( this ),
                    the_popup = self.prev( '.el-popup' )

                if ( ! $( the_popup ).length ) {
                    return
                }

                $( 'html' ).removeClass( 'openning-popup' )
                the_popup.removeClass( 'showing' )

            });

            $( document ).on( 'click', '.popup-close', function( e ) {
                e.preventDefault()

                var self = $( this ),
                    the_popup = self.closest( '.el-popup' )

                if ( ! $( the_popup ).length ) {
                    return
                }

                $( 'html' ).removeClass( 'openning-popup' )
                the_popup.removeClass( 'showing' )

            });
            
            //  close the form by escape
            // since 1.7.3
            $( document ).on( 'keydown', function( e ) {
                // ESCAPE key pressed
                if (e.keyCode == 27) {
                    $( 'html' ).removeClass( 'openning-popup' )
                    $( '.el-popup' ).removeClass( 'showing' ) // close all
                }
            });
            
        });
        
        /**
         * search form, since 1.7.3
         */
        elementorFrontend.hooks.addAction( 'frontend/element_ready/fox_search.default', function( $scope, $ ) {

            $( document ).on( 'click', '.form-showup-click .search-hit-btn', function( e ) {
                e.preventDefault();
                var form_click = $( this ).closest( '.form-showup-click' )
                form_click.addClass( 'showing_form' )
            })
            
            // close the form
            $( document ).on( 'click', function( e ) {
                if ( ! $( e.target ).is( '.form-showup-click' ) && ! $( e.target ).closest( '.form-showup-click' ).length ) {
                    $( '.form-showup-click' ).removeClass( 'showing_form' )
                } 
            });
            
            //  close the form by escape
            $( document ).on( 'keydown', function( e ) {
                // ESCAPE key pressed
                if (e.keyCode == 27) {
                    $( '.form-showup-click' ).removeClass( 'showing_form' )
                }
            });

        });
        
    });
    
    /**
     * VERTICAL NAV
     */
    var vnav_behavior = function() {
        
        /**
         * dropdown markup first
         */
        $( '.vnav' ).each(function(){
            var self = $( this )
            self.find( 'li.menu-item-has-children' ).each(function(){
                var li = $( this )
                if ( ! li.find( '>a>.caret' ).length ) {
                    li.find( '>a' ).append('<u class="caret"><i class="feather-chevron-down"></i></u>')
                }
            })
        })
        
        $( document ).on( 'click', '.vnav li.menu-item-has-children > a', function( e ) {
            var self = $( this ),
                href = self.attr( 'href' ),
                target = $( e.target ),
                li = self.parent(),
                ul = li.parent()
            
            if ( ! href || '#' == href ) {
                e.preventDefault()
            }
            
            console.log( target.attr( 'class' ) )
            
            if ( target.hasClass( 'caret' ) || target.parent().hasClass( 'caret' ) ) {
                e.preventDefault()
            }

            // ah, we don't open mega items
            if ( ! li.find('>ul').length ) {
                return
            }

            // if we're clicking to the active one
            if ( li.hasClass( 'active' ) ) {

                li.find( '>ul' ).slideUp( 'fast', 'linear', function() {
                    li.removeClass( 'active' )    
                })

            // otherwise
            } else {

                ul.find( '>li' ).each( function() {
                    var ul_li = $( this )
                    if ( ul_li.hasClass( 'active' ) ) {
                        ul_li.find( '>ul' ).slideUp( 'fast', 'linear', function() {
                            ul_li.removeClass( 'active' );
                        });
                    }
                })

                li.find( '>ul' ).slideDown( 'fast', 'linear', function(){
                    li.addClass( 'active' )   
                })


            }
        });
    }
    $( window ).on( 'elementor/frontend/init', function() {
        vnav_behavior()
        elementorFrontend.hooks.addAction( 'frontend/element_ready/fox_nav.default', function( $scope, $ ) {
            vnav_behavior()
        });
    })
	
    $( window ).on( 'elementor/frontend/init', function() {
        //hook name is 'frontend/element_ready/{widget-name}.{skin} - i dont know how skins work yet, so for now presume it will
        //always be 'default', so for example 'frontend/element_ready/slick-slider.default'
        //$scope is a jquery wrapped parent element
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-masonry.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-standard.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-newspaper.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-slider.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-group-1.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/post-group-2.default', function( $scope, $ ) {
            WITHEMES.reInit();
        });
        
    });
    
} )( jQuery );