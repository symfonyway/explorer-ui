$(document).ready(function() {

    const path = $('#folderWrapper').attr('data-href');
    const array = Object.values(JSON.parse($('#folderWrapper').attr('data-files')));
    const state = [{name: 'root', parent: false }];

    const sortArray = (arr) => {
        return arr.sort((a, b) => !a.hasOwnProperty('path') && b.hasOwnProperty('path') ? -1 : 0);
    };

    const createBreadcrumbLinks = (state) => {
        return state.map((el, ind) => `
            <li data-parent='${el.parent}' 
                class='breadcrumb-item${state.length -1 === ind ? ' active' : ''}' 
                aria-current='page'>${el.name}
            </li>
        `);
    };
    
    const parseToHtml = (arr) => {
        
        if (!arr.length)  {
            return '<div class="w-100 d-flex justify-content-center align-items-center"><h5>This folder is empty</h5></div>';
        }
        
        return arr.map(el => {
            if (!el.hasOwnProperty('path')) {
                return `
                    <div class='feature col' tabindex="0">
                        <div id='${el.id}' class="card folder" data-toggle="tooltip" title="${el.name}">
                            <div class='card-body d-flex align-items-center'>
                                <div class="feature-icon px-1 d-inline-flex align-items-center justify-content-center bg-gradient fs-2 mb-3">
                                    <i class="bi bi-folder" width="1em" height="1em"/>
                                </div>
                                <h5 class='card-title'>${el.name}</h5>
                            </div>
                        </div>
                    </div>
                `;
            } 

            const searchParam = new URLSearchParams({'key' : el.path});
            const href = path ? path + '?' + searchParam.toString() : el.path;
            return `
                <div class='feature col form' tabindex="0">
                    <div id='${el.id}' class="card" data-toggle="tooltip" title="${el.name}">
                        <a href='${href}' target="_blank" class='card-body d-flex align-items-center'>
                            <div class="feature-icon px-1 d-inline-flex align-items-center justify-content-center bg-gradient fs-2 mb-3">
                                <i class="${el.icon}" width="1em" height="1em"/>
                            </div>
                            <h5 class='card-title'>${el.name}</h5>
                        </a>
                    </div>
                </div>
            `;

        }).join('');
    };

    $('#folderWrapper').html(`
        <div class="col">
            <div class="row">
                <div class="d-flex align-items-center">
                    <button id="backButton" class="btn btn-outline-secondary btn-sm px-3" disabled="">
                        <i class="bi bi-box-arrow-left"></i>
                    </button>
                    <nav class="breadcrumb-container h-100 px-2" h-100" aria-label="breadcrumb">
                        <ol class="breadcrumb m-0 h-100 d-flex align-items-center">
                            <li data-parent="false" class="breadcrumb-item active" aria-current="page">root</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div class='file-container__list'>
                <div class='row g-4 my-3 row-cols-1 row-cols-lg-6 folder-wrap level-current'>
                    ${parseToHtml(array.filter(el => !el.parent))}
                </div>
            </div>
        </div>
    `);

    $('.breadcrumb').html(createBreadcrumbLinks(state));

    $('body').on( 'click', '.folder', function() {
        state.push(array.find(el => el.id === $(this).attr('id')))
        const nextLevel = array.filter(el => el.parent === $(this).attr('id'));
        $('.level-current').addClass('level-up').removeClass('level-current');
        $('.file-container__list')
            .append(`<div class='folder-wrap level-current row g-4 my-3 row-cols-1 row-cols-lg-6'>${parseToHtml(sortArray(nextLevel))}</div>`);
        $('#backButton').prop('disabled', $('.level-current').is(':first-child'));
        $('.breadcrumb').html(createBreadcrumbLinks(state));
        rebindTooltip();
    });
        
    $('body').on( 'click', '#backButton', function() {
        if (!$('.level-current').is(':first-child')) {
            $('.level-current').remove();
            $('.level-up').last().addClass('level-current').removeClass('level-up'); 
            $('#backButton').prop('disabled', $('.level-current').is(':first-child'));
            state.pop();
            $('.breadcrumb').html(createBreadcrumbLinks(state));
        }
        rebindTooltip();
    });

    $('body').on( 'click', '.breadcrumb-item', function() {
        while (`${state[state.length - 1].parent}` !== $(this).attr('data-parent')) {
            $('.level-current').remove();
            $('.level-up').last().addClass('level-current').removeClass('level-up'); 
            $('#backButton').prop('disabled', $('.level-current').is(':first-child'));
            state.pop();
        }
        $('.breadcrumb').html(createBreadcrumbLinks(state));
        rebindTooltip();
    });

    $(function () {
        rebindTooltip();
    });

    const rebindTooltip = () => {
        $('[data-toggle="tooltip"]').tooltip( {
            container: `body`,
            placement: 'bottom',
            trigger: 'hover'
        });
    };
});