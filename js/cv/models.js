//////////////////////////////////////////////////////////////////////////////
//
//  Functions for processing triangle mesh models
//
//  J. Madeira - Oct. 2015
//
//////////////////////////////////////////////////////////////////////////////

function computeVertexNormals( coordsArray, normalsArray ) {

	// Clearing the new normals array

	normalsArray.splice( 0, normalsArray.length );

    // Taking 3 vertices from the coordinates array

    for( var index = 0; index < coordsArray.length; index += 9 )
    {
		// Compute unit normal vector for each triangle

        var normalVector = computeNormalVector( coordsArray.slice(index, index + 3),
												coordsArray.slice(index + 3, index + 6),
												coordsArray.slice(index + 6, index + 9) );

        // Store the unit normal vector for each vertex

        for( var j = 0; j < 3; j++ )
        {
            normalsArray.push( normalVector[0], normalVector[1], normalVector[2] );
		}
	}
}