# Initiate feature (ContentInTree)
Q. Is it triggered when request state change only?
or when the content is added to tree?
or viewportchanged?

## Webkit
* RenderTreeUpdater::updateElementRenderer
* Element::updateContentVisibility


## Chromium
* https://source.chromium.org/chromium/chromium/src/+/7330cd84b2a8bafdf5a794e57b8f2cd8b6e3626c:third_party/blink/renderer/core/display_lock/display_lock_context.cc;drc=aeadb03c8553c39e88d5d11d10f706d42f06a1d7;l=72

# RelevantToUser
## Chromium
* https://source.chromium.org/chromium/chromium/src/+/7330cd84b2a8bafdf5a794e57b8f2cd8b6e3626c:third_party/blink/renderer/core/display_lock/display_lock_context.cc;drc=aeadb03c8553c39e88d5d11d10f706d42f06a1d7;l=64


# SkipRenderContent
## Gecko

## Chromium


# ContentVisibilityAutoStateChangedEvent
## Webkit
* 	class ContentVisibilityIntersectionObserverCallback
