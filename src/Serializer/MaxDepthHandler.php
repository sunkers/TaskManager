<?php
namespace App\Serializer;

class MaxDepthHandler
{
    public function __invoke($innerObject, $outerObject, $attributeName, $format = null, $context = [])
    {
        return $innerObject->getId();
    }
}
